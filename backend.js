// backend.js

// In-memory storage for users and votes using localStorage
if (!localStorage.getItem("users")) localStorage.setItem("users", JSON.stringify([]));
if (!localStorage.getItem("votes")) localStorage.setItem("votes", JSON.stringify([]));
if (!localStorage.getItem("images")) localStorage.setItem("images", JSON.stringify([]));
if (!localStorage.getItem("leaderboard")) localStorage.setItem("leaderboard", JSON.stringify([]));

function signupUser({ name, email, password, age, gender, nationality }) {
  const users = JSON.parse(localStorage.getItem("users"));
  if (users.find(u => u.email === email)) throw new Error("User already exists");

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    age,
    gender,
    nationality,
    isAdmin: false,
    uploadCount: 0,
    lastUpload: null
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  return newUser;
}

function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem('facemashUsers') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null;
}
function logoutUser() {
  localStorage.removeItem("currentUser");
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function resetPassword(email) {
  const users = JSON.parse(localStorage.getItem("users"));
  const user = users.find(u => u.email === email);
  if (!user) throw new Error("User not found");
  alert(`Password reset link sent to ${email} (simulated)`);
}

function uploadImagePair(image1Url, image2Url, uploaderId) {
  const user = getCurrentUser();
  if (!user || user.id !== uploaderId) throw new Error("Unauthorized");

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  if (user.lastUpload && now - user.lastUpload < oneDay && user.uploadCount >= 5) {
    throw new Error("Upload limit reached (5 per 24h)");
  }

  const images = JSON.parse(localStorage.getItem("images"));
  const newPair = {
    id: Date.now(),
    image1: image1Url,
    image2: image2Url,
    uploaderId,
    votes1: 0,
    votes2: 0,
    approved: user.isAdmin // auto-approved if admin
  };

  images.push(newPair);
  localStorage.setItem("images", JSON.stringify(images));

  // Update upload count
  const users = JSON.parse(localStorage.getItem("users"));
  const thisUser = users.find(u => u.id === uploaderId);
  if (thisUser.lastUpload && now - thisUser.lastUpload >= oneDay) {
    thisUser.uploadCount = 1;
  } else {
    thisUser.uploadCount += 1;
  }
  thisUser.lastUpload = now;
  localStorage.setItem("users", JSON.stringify(users));

  return newPair;
}

function getApprovedImages() {
  return JSON.parse(localStorage.getItem("images")).filter(img => img.approved);
}

function voteOnImage(imageId, selected) {
  const votes = JSON.parse(localStorage.getItem("votes"));
  const user = getCurrentUser();
  const voterId = user ? user.id : `guest-${Date.now()}`;

  if (votes.find(v => v.imageId === imageId && v.voterId === voterId)) {
    throw new Error("You already voted on this pair");
  }

  votes.push({ imageId, selected, voterId });
  localStorage.setItem("votes", JSON.stringify(votes));

  const images = JSON.parse(localStorage.getItem("images"));
  const image = images.find(i => i.id === imageId);
  if (!image) throw new Error("Image not found");

  if (selected === 1) image.votes1++;
  else if (selected === 2) image.votes2++;

  localStorage.setItem("images", JSON.stringify(images));
  updateLeaderboard(image);
}

function updateLeaderboard(image) {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard"));

  const updateScore = (url, votes) => {
    let entry = leaderboard.find(e => e.url === url);
    if (entry) entry.score += votes;
    else leaderboard.push({ url, score: votes });
  };

  updateScore(image.image1, image.votes1);
  updateScore(image.image2, image.votes2);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function getLeaderboard() {
  return JSON.parse(localStorage.getItem("leaderboard")).sort((a, b) => b.score - a.score);
}

function approveImage(imageId) {
  const user = getCurrentUser();
  if (!user || !user.isAdmin) throw new Error("Unauthorized");

  const images = JSON.parse(localStorage.getItem("images"));
  const image = images.find(i => i.id === imageId);
  if (!image) throw new Error("Image not found");

  image.approved = true;
  localStorage.setItem("images", JSON.stringify(images));
}

function getAllUsers() {
  const user = getCurrentUser();
  if (!user || !user.isAdmin) throw new Error("Unauthorized");
  return JSON.parse(localStorage.getItem("users"));
}
