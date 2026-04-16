const path = require('path');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { assessRisk, RISK_LEVELS } = require('./risk-engine');
const { generateBadge } = require('./badge');
const { pickRandom } = require('./utils');
const factors = require('../data/factors.json');
const incidents = require('../data/incidents.json');

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Limit: 120 per minute.' },
});
app.use(limiter);

app.get('/deploy', (req, res) => {
  const { tz } = req.query;

  try {
    const result = assessRisk(tz);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: `Invalid timezone '${tz}'.` });
  }
});

app.get('/deploy/badge', (req, res) => {
  const { tz } = req.query;

  try {
    const result = assessRisk(tz);
    const svg = generateBadge(result.riskLevel);
    res.set('Content-Type', 'image/svg+xml');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(svg);
  } catch (err) {
    res.status(400).json({ error: `Invalid timezone '${tz}'.` });
  }
});

app.get('/incidents/random', (_req, res) => {
  const incident = pickRandom(incidents);
  res.json(incident);
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/meta', (_req, res) => {
  res.json({
    factors,
    riskLevels: Object.keys(RISK_LEVELS),
  });
});

// 404 handler for API-like requests
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not found. Try GET /deploy, GET /deploy/badge, GET /incidents/random, GET /health, or GET /meta',
  });
});

// Only start listening if run directly (not imported by Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚨 deploy-or-regret running on http://localhost:${PORT}`);
    console.log(`   Try: http://localhost:${PORT}/deploy`);
  });
}

module.exports = app;
