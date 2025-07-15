const API = 'https://your-backend.vercel.app'; // Replace with actual backend URL

// Utils
function getToken() {
  return localStorage.getItem('token');
}

function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  };
}

// Signup
async function signup(email, password, confirmPassword, gender, nationality, age) {
  if (password !== confirmPassword) throw new Error('Passwords do not match');

  const res = await fetch(`${API}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, gender, nationality, age })
  });

  if (!res.ok) throw new Error(await res.text());
  alert(await res.text());
}

// Login
async function login(email, password) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw new Error(await res.text());

  const data = await res.json();
  localStorage.setItem('token', data.token);
  alert('Login successful');
  window.location.href = '/facemash-clone/upload.html';
}

// Upload images
async function uploadImagePair(file1, file2) {
  const formData = new FormData();
  formData.append('images', file1);
  formData.append('images', file2);

  const res = await fetch(`${API}/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData
  });

  if (!res.ok) throw new Error(await res.text());
  alert(await res.text());
}

// Get voting pair
async function getVotingPair() {
  const res = await fetch(`${API}/vote-pair`);
  if (!res.ok) throw new Error('No voting pairs available');
  return await res.json();
}

// Cast vote
async function vote(imageId, choice) {
  const res = await fetch(`${API}/vote`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ imageId, choice })
  });

  if (!res.ok) throw new Error(await res.text());
  alert('Vote casted successfully');
}

// Fetch leaderboard
async function fetchLeaderboard() {
  const res = await fetch(`${API}/leaderboard`);
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return await res.json();
}

// Admin-only: Approve image
async function approveImage(imageId) {
  const res = await fetch(`${API}/approve-image`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ imageId })
  });

  if (!res.ok) throw new Error(await res.text());
  alert('Image approved');
}

// Admin-only: Get all users
async function fetchUsers() {
  const res = await fetch(`${API}/users`, {
    headers: getAuthHeaders()
  });

  if (!res.ok
