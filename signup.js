document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  if (!signupForm) return;

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = signupForm.name.value.trim();
    const email = signupForm.email.value.trim().toLowerCase();
    const password = signupForm.password.value;

    if (!name || !email || !password) {
      alert("All fields are required.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.some(u => u.email === email)) {
      alert("Email already exists.");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      role: email.includes("@admin") ? "admin" : "user"
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created successfully. Please log in.");
    window.location.href = "login.html";
  });
});
