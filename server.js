// backend.js (Node.js + Express)
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const SECRET = 'secure_secret';
const ADMIN = { email: 'admin@example.com', password: 'admin123' };

let images = [];

// Authentication
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN.email && password === ADMIN.password) {
    const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Unauthorized' });
});

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err) => {
    if (err) return res.sendStatus(403);
    next();
  });
}

// Get all images
app.get('/images', (req, res) => {
  res.json(images);
});

// Upload an image (admin only)
app.post('/upload', authMiddleware, (req, res) => {
  const { base64 } = req.body;
  const newImage = {
    id: Date.now(),
    src: base64,
    score: 1000,
    votes: 0
  };
  images.push(newImage);
  res.json({ success: true });
});

// Vote endpoint
app.post('/vote', (req, res) => {
  const { winnerId, loserId } = req.body;
  const winner = images.find(i => i.id === winnerId);
  const loser = images.find(i => i.id === loserId);
  if (!winner || !loser) return res.sendStatus(400);
  const k = 32;
  const expectedWin = 1 / (1 + Math.pow(10, (loser.score - winner.score) / 400));
  winner.score += Math.round(k * (1 - expectedWin));
  loser.score -= Math.round(k * expectedWin);
  winner.votes += 1;
  res.json({ success: true });
});

// Leaderboard
app.get('/leaderboard', (req, res) => {
  const sorted = [...images].sort((a, b) => b.score - a.score);
  res.json(sorted);
});

// Export to file
app.post('/export', authMiddleware, (req, res) => {
  fs.writeFileSync('backup.json', JSON.stringify(images, null, 2));
  res.json({ success: true });
});

// Import from file or JSON
app.post('/import', authMiddleware, (req, res) => {
  try {
    const json = JSON.parse(req.body.json);
    if (Array.isArray(json)) {
      images = json;
      return res.json({ success: true });
    }
    throw new Error();
  } catch {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
