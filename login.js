document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  const user = loginUser(email, password);
  if (user) {
    alert(`Welcome back, ${user.name || user.email}!`);
    window.location.href = 'upload.html'; // or vote.html or any page you want
  } else {
    alert('Invalid login credentials');
  }
});
