document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    console.error("Login form not found!");
    return;
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const user = loginUser(email, password);

    if (user) {
      localStorage.setItem("facemashLoggedInUser", JSON.stringify(user));
      alert("Login successful!");
      window.location.href = "vote.html";
    } else {
      alert("Invalid email or password. Please try again.");
    }
  });
});
