
document.getElementById("login-form").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const pwd = document.getElementById("loginPassword").value;
  try {
    loginUser({email, password: pwd}); // localStorage backend
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user.role === "admin") window.location.href = "upload.html";
    else window.location.href = "vote.html";
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById("reset-link").addEventListener("click", e => {
  e.preventDefault();
  const email = prompt("Enter your email:");
  if (email) alert(`(Simulated) reset link sent to ${email}`);
});
