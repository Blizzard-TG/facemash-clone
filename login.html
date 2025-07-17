document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim().toLowerCase();
    const password = loginForm.password.value;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("Invalid credentials.");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    alert(`Welcome ${user.name}!`);
    window.location.href = user.role === "admin" ? "admin.html" : "index.html";
  });
});
