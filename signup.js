document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const age = parseInt(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;
  const nationality = document.getElementById("nationality").value.trim();

  if (!name || !email || !password || !confirmPassword || !age || !gender || !nationality) {
    return alert("All fields are required.");
  }

  if (password !== confirmPassword) {
    return alert("Passwords do not match.");
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.email === email)) {
    return alert("This email is already registered.");
  }

  const newUser = {
    name,
    email,
    password,
    age,
    gender,
    nationality,
    role: "user", // default role
    uploads: [],
    votes: [],
    createdAt: Date.now()
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created successfully. Please login.");
  window.location.href = "facemash-clone/login.html";
});
