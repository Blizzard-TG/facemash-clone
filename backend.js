// Simple In-Browser Backend Logic (Simulated Backend)

const backend = (() => {
  const USERS_KEY = 'pm_users';
  const UPLOADS_KEY = 'pm_uploads';
  const VOTES_KEY = 'pm_votes';
  const LEADERBOARD_KEY = 'pm_leaderboard';
  const CURRENT_USER_KEY = 'pm_current_user';

  const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const getUploads = () => JSON.parse(localStorage.getItem(UPLOADS_KEY)) || [];
  const saveUploads = (uploads) => localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads));

  const getVotes = () => JSON.parse(localStorage.getItem(VOTES_KEY)) || [];
  const saveVotes = (votes) => localStorage.setItem(VOTES_KEY, JSON.stringify(votes));

  const getLeaderboard = () => JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
  const saveLeaderboard = (data) => localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data));

  const setCurrentUser = (user) => localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  const getCurrentUser = () => JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  const logout = () => localStorage.removeItem(CURRENT_USER_KEY);

  return {
    registerUser(user) {
      const users = getUsers();
      if (users.find(u => u.email === user.email)) {
        throw new Error('Email already exists');
      }
      users.push(user);
      saveUsers(users);
    },

    login(email, password) {
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid credentials');
      setCurrentUser(user);
      return user;
    },

    getCurrentUser,
    logout,

    uploadImages(pair) {
      const user = getCurrentUser();
      if (!user) throw new Error('Login required');

      const uploads = getUploads();
      const now = Date.now();
      const dayLimit = 5;
      const last24 = uploads.filter(u => u.user === user.email && (now - u.time < 86400000));
      if (last24.length >= dayLimit) throw new Error('Upload limit reached');

      uploads.push({ ...pair, user: user.email, time: now, approved: false });
      saveUploads(uploads);
    },

    getPendingApprovals() {
      return getUploads().filter(u => !u.approved);
    },

    approveUpload(index) {
      const uploads = getUploads();
      if (uploads[index]) uploads[index].approved = true;
      saveUploads(uploads);
    },

    getApprovedPairs() {
      return getUploads().filter(u => u.approved);
    },

    vote(imageUrl) {
      const user = getCurrentUser();
      const votes = getVotes();
      const today = new Date().toDateString();

      if (user && votes.find(v => v.user === user.email && v.image === imageUrl && v.date === today)) {
        throw new Error('You already voted on this image today');
      }

      votes.push({ image: imageUrl, user: user?.email || 'guest', date: today });
      saveVotes(votes);

      const leaderboard = getLeaderboard();
      const entry = leaderboard.find(i => i.image === imageUrl);
      if (entry) {
        entry.votes += 1;
      } else {
        leaderboard.push({ image: imageUrl, votes: 1 });
      }
      saveLeaderboard(leaderboard);
    },

    getLeaderboard
  };
})();
