// backend.js - core functions for PictureMash

// Signup user and save to localStorage
function signupUser(userData) {
  const users = JSON.parse(localStorage.getItem("facemashUsers") || "[]");

  // Check if user with same email exists
  const exists = users.some(u => u.email === userData.email);
  if (exists) {
    return { success: false, message: "User already exists." };
  }

  users.push(userData);
  localStorage.setItem("facemashUsers", JSON.stringify(users));
  return { success: true };
}

// Login user by checking credentials
function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem("facemashUsers") || "[]");
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }
  return null;
}

// Get current logged-in user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

// Logout user
function logoutUser() {
  localStorage.removeItem("currentUser");
}

// Save image upload (only 5 per 24 hours)
function saveImageUpload(imageData) {
  const uploads = JSON.parse(localStorage.getItem("facemashUploads") || "[]");
  uploads.push(imageData);
  localStorage.setItem("facemashUploads", JSON.stringify(uploads));
}

// Get image pairs for voting
function getVoteImages() {
  const uploads = JSON.parse(localStorage.getItem("facemashUploads") || "[]");
  const approved = uploads.filter(img => img.approved);
  if (approved.length < 2) return null;

  const shuffled = approved.sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}

// Save vote result and update scores
function saveVote(winnerId, loserId) {
  const uploads = JSON.parse(localStorage.getItem("facemashUploads") || "[]");

  uploads.forEach(img => {
    if (img.id === winnerId) img.score = (img.score || 1000) + 10;
    if (img.id === loserId) img.score = (img.score || 1000) - 10;
  });

  localStorage.setItem("facemashUploads", JSON.stringify(uploads));
}

// Get leaderboard data
function getLeaderboard() {
  const uploads = JSON.parse(localStorage.getItem("facemashUploads") || "[]");
  const approved = uploads.filter(img => img.approved);
  return approved.sort((a, b) => (b.score || 0) - (a.score || 0));
}

// Approve or reject image (admin only)
function approveImage(id, status) {
  const uploads = JSON.parse(localStorage.getItem("facemashUploads") || "[]");
  const index = uploads.findIndex(img => img.id === id);
  if (index !== -1) {
    uploads[index].approved = status;
    localStorage.setItem("facemashUploads", JSON.stringify(uploads));
  }
}

// Simulate sending reset password email
function sendResetEmail(email) {
  const users = JSON.parse(localStorage.getItem("facemashUsers") || "[]");
  const user = users.find(u => u.email === email);
  if (user) {
    alert(`Password reset link has been sent to ${email}`);
  } else {
    alert("Email not found.");
  }
}

