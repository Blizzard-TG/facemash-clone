document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById("signupForm");

  if (!signupForm) return;

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("signupEmail").value.trim(),
      password: document.getElementById("signupPassword").value,
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      nationality: document.getElementById("nationality").value,
    };

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const exists = users.some((u) => u.email === user.email);

    if (exists) {
      alert("User already exists.");
      return;
    }

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful!");
    window.location.href = "login.html";
  });
});
