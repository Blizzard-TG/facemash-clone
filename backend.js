// Simple localStorage-based backend simulation

// Utility Functions
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function getImages() {
  return JSON.parse(localStorage.getItem("images") || "[]");
}

function setImages(images) {
  localStorage.setItem("images", JSON.stringify(images));
}

function getVotes() {
  return JSON.parse(localStorage.getItem("votes") || "[]");
}

function setVotes(votes) {
  localStorage.setItem("votes", JSON.stringify(votes));
}

// Sign Up
function signupUser(data) {
  const users = getUsers();
  if (users.find(u => u.email === data.email)) {
    alert("Email already exists.");
    return false;
  }
  users.push({ ...data, role: "user" });
  setUsers(users);
  return true;
}

// Login
function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    alert("Invalid credentials.");
    return false;
  }
  setCurrentUser(user);
  return true;
}

// Logout
function logoutUser() {
  localStorage.removeItem("currentUser");
}

// Upload image
function uploadImage(imageDataUrl) {
  const images = getImages();
  const user = getCurrentUser();
  if (!user) return alert("Not logged in.");
  const userUploads = images.filter(img => img.uploadedBy === user.email);
  const now = Date.now();
  const uploadsIn24h = userUploads.filter(img => now - img.timestamp < 24 * 60 * 60 * 1000);
  if (uploadsIn24h.length >= 5) {
    return alert("Upload limit reached (5 per 24 hours).");
  }

  const newImg = {
    id: crypto.randomUUID(),
    url: imageDataUrl,
    uploadedBy: user.email,
    approved: user.role === "admin",
    score: 1000,
    timestamp: now
  };

  images.push(newImg);
  setImages(images);
  alert("Image uploaded" + (newImg.approved ? "." : " and pending admin approval."));
}

// Voting
function voteImage(winnerId, loserId) {
  const images = getImages();
  const winner = images.find(i => i.id === winnerId);
  const loser = images.find(i => i.id === loserId);

  if (!winner || !loser) return;

  // Elo-like scoring
  const k = 32;
  const expectedScore = 1 / (1 + Math.pow(10, (loser.score - winner.score) / 400));
  winner.score += Math.round(k * (1 - expectedScore));
  loser.score -= Math.round(k * expectedScore);

  setImages(images);

  // Store votes
  const votes = getVotes();
  votes.push({ winnerId, loserId, timestamp: Date.now() });
  setVotes(votes);
}

// Leaderboard
function getLeaderboard() {
  return getImages()
    .filter(img => img.approved)
    .sort((a, b) => b.score - a.score);
}

// Admin: Approve image
function approveImage(imageId) {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") return alert("Admin access only.");
  const images = getImages();
  const img = images.find(i => i.id === imageId);
  if (img) img.approved = true;
  setImages(images);
}

// Admin: Override score
function updateScore(imageId, newScore) {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") return alert("Admin access only.");
  const images = getImages();
  const img = images.find(i => i.id === imageId);
  if (img) img.score = newScore;
  setImages(images);
}

// Compliments
function leaveCompliment(imageId, text) {
  const user = getCurrentUser();
  if (!user) return alert("Only logged-in users can leave compliments.");
  const compliments = JSON.parse(localStorage.getItem("compliments") || "[]");
  compliments.push({ imageId, text, by: user.email, time: Date.now() });
  localStorage.setItem("compliments", JSON.stringify(compliments));
}

// Admin: Get pending approval images
function getPendingImages() {
  const images = getImages();
  return images.filter(img => !img.approved);
}

// Get compliments for image
function getCompliments(imageId) {
  const compliments = JSON.parse(localStorage.getItem("compliments") || "[]");
  return compliments.filter(c => c.imageId === imageId);
}

// Password reset simulation
function resetPassword(email) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    alert("Password reset link has been sent to " + email);
  } else {
    alert("Email not found.");
  }
}
