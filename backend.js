// backend.js

const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// In-memory storage (replace with a database for production)
let users = []; // {email, passwordHash, role, gender, nationality, age, verified}
let images = []; // {id, url1, url2, score1, score2, approved, uploader, timestamp}
let votes = []; // {voterId, imageId, timestamp}

const upload = multer({ dest: 'public/uploads/' });
const SECRET = 'your_jwt_secret';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password'
  }
});

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/signup', async (req, res) => {
  const { email, password, gender, nationality, age } = req.body;
  if (users.find(u => u.email === email)) return res.status(409).send('Email already used');
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = { email, passwordHash, role: 'user', gender, nationality, age, verified: false };
  users.push(newUser);
  
  // Send verification email (mocked)
  await transporter.sendMail({
    to: email,
    subject: 'Verify your email',
    text: 'Click the link to verify your account (mock)'
  });

  res.send('Signup successful. Check your email to verify.');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).send('Invalid credentials');
  if (!user.verified) return res.status(403).send('Email not verified');

  const token = jwt.sign({ email, role: user.role }, SECRET);
  res.json({ token });
});

app.post('/upload', authenticateToken, upload.array('images', 2), (req, res) => {
  const now = Date.now();
  const todayUploads = images.filter(img => img.uploader === req.user.email && now - img.timestamp < 86400000);
  if (req.user.role === 'user' && todayUploads.length >= 5) return res.status(429).send('Daily upload limit reached');

  const [img1, img2] = req.files;
  const newImage = {
    id: Date.now().toString(),
    url1: '/uploads/' + img1.filename,
    url2: '/uploads/' + img2.filename,
    score1: 0,
    score2: 0,
    approved: req.user.role === 'admin',
    uploader: req.user.email,
    timestamp: now
  };
  images.push(newImage);
  res.send('Uploaded successfully. Pending approval if not admin.');
});

app.get('/vote-pair', (req, res) => {
  const available = images.find(img => img.approved);
  if (!available) return res.status(404).send('No approved images');
  res.json(available);
});

app.post('/vote', authenticateToken, (req, res) => {
  const { imageId, choice } = req.body;
  const hasVoted = votes.find(v => v.voterId === req.user.email && v.imageId === imageId);
  if (hasVoted) return res.status(403).send('Already voted');

  const img = images.find(i => i.id === imageId);
  if (!img) return res.status(404).send('Image pair not found');
  if (choice === '1') img.score1++;
  else if (choice === '2') img.score2++;
  else return res.status(400).send('Invalid choice');

  votes.push({ voterId: req.user.email, imageId, timestamp: Date.now() });
  res.send('Vote recorded');
});

app.get('/leaderboard', (req, res) => {
  const sorted = [...images.filter(i => i.approved)].sort((a, b) => (b.score1 + b.score2) - (a.score1 + a.score2));
  res.json(sorted.slice(0, 10));
});

app.get('/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  res.json(users);
});

app.post('/approve-image', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  const img = images.find(i => i.id === req.body.imageId);
  if (!img) return res.status(404).send('Image not found');
  img.approved = true;
  res.send('Image approved');
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
