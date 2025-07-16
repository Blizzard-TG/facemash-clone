<!-- backend.js -->
<script>
// Simplified backend simulation with localStorage logic
const users = JSON.parse(localStorage.getItem("users") || "[]");

function signupUser(user) {
  if (users.find((u) => u.email === user.email)) {
    alert("User already exists.");
    return false;
  }
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

function loginUser(email, password) {
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return null;
  localStorage.setItem("currentUser", JSON.stringify(user));
  return user;
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}
</script>
