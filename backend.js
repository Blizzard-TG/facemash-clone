// backend.js

// Load admin credentials from localStorage or default to hardcoded
const ADMIN_EMAIL = localStorage.getItem("ADMIN_EMAIL") || "admin@example.com";
const ADMIN_PASSWORD = localStorage.getItem("ADMIN_PASSWORD") || "admin123";

// User authentication system using localStorage
function signupUser(userData) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const exists = users.some((u) => u.email === userData.email);
  if (exists) return { success: false, message: "User already exists." };
  users.push(userData);
  localStorage.setItem("users", JSON.stringify(users));
  return { success: true, message: "Signup successful." };
}

function loginUser(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return { success: true, role: "admin", message: "Welcome Admin" };
  }
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    return { success: true, role: "user", message: "Login successful." };
  }
  return { success: false, message: "Invalid credentials." };
}

function saveImage(data) {
  let images = JSON.parse(localStorage.getItem("images")) || [];
  images.push({ ...data, approved: false });
  localStorage.setItem("images", JSON.stringify(images));
  return true;
}

function getApprovedImages() {
  const images = JSON.parse(localStorage.getItem("images")) || [];
  return images.filter((img) => img.approved);
}

function getUnapprovedImages() {
  const images = JSON.parse(localStorage.getItem("images")) || [];
  return images.filter((img) => !img.approved);
}

function approveImage(index) {
  let images = JSON.parse(localStorage.getItem("images")) || [];
  if (images[index]) {
    images[index].approved = true;
    localStorage.setItem("images", JSON.stringify(images));
    return true;
  }
  return false;
}

function voteImage(index) {
  let images = JSON.parse(localStorage.getItem("images")) || [];
  if (images[index]) {
    images[index].votes = (images[index].votes || 0) + 1;
    localStorage.setItem("images", JSON.stringify(images));
    return true;
  }
  return false;
}

function getLeaderboard() {
  const images = JSON.parse(localStorage.getItem("images")) || [];
  return images.filter((img) => img.approved).sort((a, b) => (b.votes || 0) - (a.votes || 0));
}

function resetVotes() {
  let images = JSON.parse(localStorage.getItem("images")) || [];
  images = images.map((img) => ({ ...img, votes: 0 }));
  localStorage.setItem("images", JSON.stringify(images));
  return true;
}

function addCompliment(compliment) {
  let compliments = JSON.parse(localStorage.getItem("compliments")) || [];
  compliments.push(compliment);
  localStorage.setItem("compliments", JSON.stringify(compliments));
}

function getCompliments() {
  return JSON.parse(localStorage.getItem("compliments")) || [];
}

function resetAdminCredentials(email, password) {
  localStorage.setItem("ADMIN_EMAIL", email);
  localStorage.setItem("ADMIN_PASSWORD", password);
  return true;
}

// Expose methods globally
window.backend = {
  signupUser,
  loginUser,
  saveImage,
  getApprovedImages,
  getUnapprovedImages,
  approveImage,
  voteImage,
  getLeaderboard,
  resetVotes,
  addCompliment,
  getCompliments,
  resetAdminCredentials,
};
