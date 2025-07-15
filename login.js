/** login.js - Handles user login logic */

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  const messageBox = document.getElementById("message-box") || createMessageBox();

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    messageBox.innerText = `Welcome back, ${user.name || "user"}!`;
    messageBox.style.display = "block";

    setTimeout(() => {
      window.location.href = user.isAdmin ? "upload.html" : "vote.html";
    }, 1000);
  } else {
    messageBox.innerText = "Invalid email or password.";
    messageBox.style.display = "block";
  }
});

function createMessageBox() {
  const box = document.createElement("div");
  box.id = "message-box";
  document.body.insertBefore(box, loginForm);
  return box;
}
