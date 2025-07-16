document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (loginUser(email, password)) {
      alert("Login successful!");
      window.location.href = "vote.html";
    } else {
      alert("Invalid email or password.");
    }
  });
});
