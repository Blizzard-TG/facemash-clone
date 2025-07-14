// script.js
const backend = 'http://localhost:3000';
let token = '';
let images = [];

function showSection(id) {
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'voteSection') loadImages();
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch(`${backend}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (res.ok) {
    const data = await res.json();
    token = data.token;
    alert("Logged in!");
  } else {
    alert("Login failed");
  }
}

async function upload() {
  const file = document.getElementById('fileUpload').files[0];
  if (!file) return alert("No file selected");
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64 = reader.result;
    const res = await fetch(`${backend}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ base64 })
    });
    if (res.ok) alert("Image uploaded!");
    else alert("Upload failed");
  };
  reader.readAsDataURL(file);
}

async function loadImages() {
  const res = await fetch(`${backend}/images`);
  images = await res.json();
  if (images.length < 2) return;
  const [a, b] = getTwoRandom(images);
  document.getElementById('imgA').src = a.src;
  document.getElementById('imgA').dataset.id = a.id;
  document.getElementById('imgB').src = b.src;
  document.getElementById('imgB').dataset.id = b.id;
}

function getTwoRandom(arr) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}

async function vote(choice) {
  const winnerId = document.getElementById(`img${choice}`).dataset.id;
  const loserId = document.getElementById(`img${choice === 'A' ? 'B' : 'A'}`).dataset.id;
  const res = await fetch(`${backend}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ winnerId: Number(winnerId), loserId: Number(loserId) })
  });
  if (res.ok) loadImages();
}

async function getLeaderboard() {
  const res = await fetch(`${backend}/leaderboard`);
  const data = await res.json();
  const board = document.getElementById('leaderboard');
  board.innerHTML = '';
  data.forEach((img, i) => {
    board.innerHTML += `<p>#${i + 1} - Votes: ${img.votes}, Score: ${img.score}</p>`;
  });
}

window.onload = loadImages;
