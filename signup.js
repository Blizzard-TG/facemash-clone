// signup.js

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const nationality = document.getElementById("nationality").value;

  const messageBox = document.getElementById("message-box");

  // Validation
  if (!name || !email || !password || !confirmPassword || !age || !gender || !nationality) {
    messageBox.textContent = "Please fill out all fields.";
    messageBox.style.backgroundColor = "#f8d7da";
    messageBox.style.color = "#721c24";
    messageBox.style.display = "block";
    return;
  }

  if (password !== confirmPassword) {
    messageBox.textContent = "Passwords do not match.";
    messageBox.style.backgroundColor = "#f8d7da";
    messageBox.style.color = "#721c24";
    messageBox.style.display = "block";
    return;
  }

  // Check if user already exists
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.some(user => user.email === email);
  if (userExists) {
    messageBox.textContent = "An account with this email already exists.";
    messageBox.style.backgroundColor = "#f8d7da";
    messageBox.style.color = "#721c24";
    messageBox.style.display = "block";
    return;
  }

  const newUser = {
    name,
    email,
    password,
    age,
    gender,
    nationality,
    role: "user",
    uploads: [],
    votes: [],
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  messageBox.textContent = "Signup successful! Redirecting to login...";
  messageBox.style.backgroundColor = "#d4edda";
  messageBox.style.color = "#155724";
  messageBox.style.display = "block";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
});
