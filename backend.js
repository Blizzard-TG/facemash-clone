// backend.js (All logic handled with LocalStorage — no external backend)

// ---------- LOCAL STORAGE UTILITIES ----------
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getUploads() {
  return JSON.parse(localStorage.getItem("uploads")) || [];
}

function saveUploads(uploads) {
  localStorage.setItem("uploads", JSON.stringify(uploads));
}

function getVotes() {
  return JSON.parse(localStorage.getItem("votes")) || [];
}

function saveVotes(votes) {
  localStorage.setItem("votes", JSON.stringify(votes));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem("currentUser");
}

// ---------- AUTHENTICATION ----------
function signupUser(userData) {
  const users = getUsers();
  if (users.some((u) => u.email === userData.email)) {
    throw new Error("Email already registered.");
  }
  users.push(userData);
  saveUsers(users);
  return "Signup successful.";
}

function loginUser({ email, password }) {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid credentials");
  setCurrentUser(user);
  return user;
}

// ---------- IMAGE UPLOAD ----------
function uploadImages(image1Base64, image2Base64) {
  const uploads = getUploads();
  const user = getCurrentUser();
  const timestamp = Date.now();

  if (!user) throw new Error("Login required to upload images.");

  // Limit 5 uploads per 24 hrs
  const lastUploads = uploads.filter(
    (u) => u.uploader === user.email && timestamp - u.timestamp < 86400000
  );
  if (lastUploads.length >= 5) throw new Error("Upload limit reached.");

  uploads.push({
    id: Date.now(),
    uploader: user.email,
    approved: user.role === "admin",
    image1: image1Base64,
    image2: image2Base64,
    votes1: 0,
    votes2: 0,
    timestamp,
  });
  saveUploads(uploads);
  return "Uploaded successfully";
}

// ---------- VOTING ----------
function getVotePair() {
  const uploads = getUploads().filter((u) => u.approved);
  if (uploads.length === 0) throw new Error("No approved images.");
  return uploads[Math.floor(Math.random() * uploads.length)];
}

function submitVote(uploadId, choice) {
  const user = getCurrentUser();
  let voterId;

  if (user) {
    voterId = user.email;
  } else {
    voterId = localStorage.getItem("voterId");
    if (!voterId) voterId = generateGuestId();
  }

  const votes = getVotes();
  const existing = votes.find((v) => v.voter === voterId && v.uploadId === uploadId);
  if (existing) throw new Error("Already voted.");

  const uploads = getUploads();
  const upload = uploads.find((u) => u.id === uploadId);
  if (!upload) throw new Error("Upload not found.");

  if (choice === 1) upload.votes1++;
  else if (choice === 2) upload.votes2++;

  votes.push({ voter: voterId, uploadId });
  saveUploads(uploads);
  saveVotes(votes);

  return "Vote submitted.";
}

function generateGuestId() {
  const id = 'guest-' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("voterId", id);
  return id;
}

// ---------- LEADERBOARD ----------
function getLeaderboard() {
  const uploads = getUploads().filter((u) => u.approved);
  return uploads
    .map((u) => ({
      id: u.id,
      uploader: u.uploader,
      votes1: u.votes1,
      votes2: u.votes2,
      total: u.votes1 + u.votes2,
    }))
    .sort((a, b) => b.total - a.total);
}

// ---------- ADMIN FUNCTIONS ----------
function approveImage(uploadId) {
  const uploads = getUploads();
  const upload = uploads.find((u) => u.id === uploadId);
  if (upload) upload.approved = true;
  saveUploads(uploads);
  return "Approved.";
}

function getAllUsers() {
  return getUsers();
}

function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin";
}

function resetUserData() {
  localStorage.removeItem("users");
  localStorage.removeItem("uploads");
  localStorage.removeItem("votes");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("voterId");
}
