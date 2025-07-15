// login.js

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Store session
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // Redirect to upload page if regular user, admin dashboard otherwise
    if (user.role === "admin") {
      alert("Welcome Admin!");
      window.location.href = "upload.html"; // Admin uploads and verifies here
    } else {
      alert("Login successful!");
      window.location.href = "vote.html"; // Users go to vote
    }
  } else {
    alert("Invalid email or password.");
  }
});

function sendResetLink(email) {
  // Simulate sending reset link (not real email logic)
  alert(`Reset link sent to ${email}. (Simulated)`);
}

document.getElementById("reset-link").addEventListener("click", (e) => {
  e.preventDefault();
  const email = prompt("Enter your email to reset your password:");
  if (email) alert(`Reset link (simulated) sent to ${email}`);

});
