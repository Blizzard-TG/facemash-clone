// backend.js

// Utility Functions
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function isAdmin(user) {
  return user && user.role === "admin";
}

// Signup Function
function signupUser(email, password, isAdminFlag = false) {
  const users = getUsers();
  const exists = users.some(u => u.email === email);
  if (exists) throw new Error("User already exists");

  const newUser = { email, password, role: isAdminFlag ? "admin" : "user" };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// Login Function
function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid credentials");
  setCurrentUser(user);
  return user;
}

// Logout
function logoutUser() {
  localStorage.removeItem("currentUser");
}

// Password Reset (Simulation)
function resetPassword(email, newPassword) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) throw new Error("User not found");
  user.password = newPassword;
  saveUsers(users);
  return true;
}
