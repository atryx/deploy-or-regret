<!-- GitAds-Verify: PLACEHOLDER_VERIFY_CODE -->

# 🚨 Deploy-or-Regret

<p align="center">
  <strong>An over-engineered decision engine for the most important question in DevOps.</strong>
</p>

<!-- GitAds Sponsorship Badge -->
<p align="center">
  <a href="https://gitads.dev/v1/ad-track?source=atryx/deploy-or-regret@github">
    <img src="https://gitads.dev/v1/ad-serve?source=atryx/deploy-or-regret@github" alt="Sponsored by GitAds" />
  </a>
</p>

<p align="center">
  <a href="#-api-usage"><img src="https://img.shields.io/badge/API-Live-brightgreen" alt="API Live" /></a>
  <a href="https://github.com/atryx/deploy-or-regret/actions"><img src="https://github.com/atryx/deploy-or-regret/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/atryx/deploy-or-regret/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License: MIT" /></a>
  <a href="https://github.com/atryx/deploy-or-regret/stargazers"><img src="https://img.shields.io/github/stars/atryx/deploy-or-regret?style=social" alt="Stars" /></a>
</p>

---

Should you deploy right now? Probably not.  
This API calculates a real-time deployment risk score based on the day of the week, time of day, special dates, and pure chaos — then tells you exactly why you should (or shouldn't) push to production.

Built for engineers, CI/CD pipelines, and anyone who has ever deployed on a Friday.

> ⭐ **Star this repo** to bookmark it — you'll need it before your next deploy.

---

## 🚀 API Usage

**Base URL**
```
https://deploy-or-regret.vercel.app
```

**Method:** `GET`  
**Rate Limit:** `120 requests per minute per IP`

### 🔄 Basic Request

```http
GET /deploy
```

### ✅ Example Responses

**Friday at 5 PM (CRITICAL):**
```json
{
  "shouldDeploy": false,
  "riskLevel": "CRITICAL",
  "score": 87,
  "factors": ["friday", "after-hours"],
  "reason": "It's Friday at 4:47 PM. Even your CI pipeline is begging you to stop.",
  "incident": {
    "title": "Knight Capital Trading Glitch (2012)",
    "summary": "A deployment error activated old test code, causing the firm to lose $440 million in 45 minutes.",
    "lesson": "Clean up dead code. It might not be as dead as you think.",
    "year": 2012,
    "severity": "catastrophic"
  },
  "advice": "Close the laptop. Go home. Deploy Monday.",
  "timestamp": "2026-01-16T17:00:00.000Z",
  "timezone": "UTC"
}
```

**Tuesday at 10 AM (LOW):**
```json
{
  "shouldDeploy": true,
  "riskLevel": "LOW",
  "score": 18,
  "factors": [],
  "reason": "Tuesday at 10 AM: peak deployment clarity. The engineering gods approve.",
  "incident": {
    "title": "NPM Left-Pad Incident (2016)",
    "summary": "A developer unpublished an 11-line npm package, breaking thousands of builds.",
    "lesson": "Your 11-line utility might be holding the internet together.",
    "year": 2016,
    "severity": "major"
  },
  "advice": "Ship it! The stars are aligned.",
  "timestamp": "2026-01-13T10:00:00.000Z",
  "timezone": "UTC"
}
```

**Holiday Freeze (Dec 25):**
```json
{
  "shouldDeploy": false,
  "riskLevel": "CRITICAL",
  "score": 95,
  "factors": ["holiday-freeze"],
  "reason": "It's the holiday freeze. Even Santa wouldn't deploy right now.",
  "incident": {
    "title": "Valve Steam Store Caching Disaster (2015)",
    "summary": "A caching misconfiguration on Christmas Day caused users to see other users' account details.",
    "lesson": "Cache invalidation and deploying on Christmas: two of the hardest problems.",
    "year": 2015,
    "severity": "major"
  },
  "advice": "Step away from the keyboard. Slowly.",
  "timestamp": "2026-12-25T14:00:00.000Z",
  "timezone": "UTC"
}
```

---

## 🎛️ Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `tz` | Timezone (IANA format) | `America/New_York`, `Europe/Bucharest`, `Asia/Tokyo` |

```http
GET /deploy?tz=America/New_York
```

---

## 📡 Other Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /deploy` | Full risk assessment |
| `GET /deploy/badge` | SVG badge with current risk level |
| `GET /incidents/random` | Random famous deployment disaster |
| `GET /meta` | List all risk factors and levels |
| `GET /health` | Health check |

### Random Incident

```http
GET /incidents/random
```

```json
{
  "title": "Facebook Global Outage (2021)",
  "summary": "A routine BGP maintenance command withdrew Facebook's DNS routes, taking down Facebook, Instagram, and WhatsApp for over 6 hours.",
  "lesson": "Don't lock yourself out of the building while doing maintenance on the locks.",
  "year": 2021,
  "severity": "catastrophic"
}
```

---

## 🏷️ SVG Badge

Embed the current deployment risk in your README:

```markdown
![Deploy Risk](https://deploy-or-regret.vercel.app/deploy/badge)
```

![Deploy Risk](https://deploy-or-regret.vercel.app/deploy/badge)

With timezone:
```markdown
![Deploy Risk](https://deploy-or-regret.vercel.app/deploy/badge?tz=America/New_York)
```

The badge updates in real-time with color-coded risk levels:
- 🟢 **LOW** — Ship it!
- 🟡 **MODERATE** — Proceed with caution
- 🟠 **HIGH** — Are you sure about this?
- 🔴 **CRITICAL** — Step away from the keyboard

---

## 🛠️ Self-Hosting

### 1. Clone this repository

```bash
git clone https://github.com/atryx/deploy-or-regret.git
cd deploy-or-regret
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
npm start
```

The API will be live at:
```
http://localhost:3000/deploy
```

Change the port:
```bash
PORT=5000 npm start
```

---

## ▲ Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fatryx%2Fdeploy-or-regret)

One click. Zero config. Free tier.

---

## 📁 Project Structure

```
deploy-or-regret/
├── api/
│   └── index.js              # Vercel serverless entry point
├── src/
│   ├── app.js                # Express API
│   ├── risk-engine.js        # Risk calculation engine
│   ├── badge.js              # SVG badge generator
│   └── utils.js              # Helper functions
├── data/
│   ├── reasons.json          # ~100 deployment risk reasons
│   ├── incidents.json        # ~50 famous deployment disasters
│   ├── factors.json          # ~15 risk factor definitions
│   └── advice.json           # ~60 deployment advice entries
├── test/                     # Jest tests
├── vercel.json
├── package.json
└── README.md
```

---

## 🤝 Contributing

**Adding new incidents and reasons is the easiest way to contribute!**

1. Pick a data file: `reasons.json`, `incidents.json`, or `advice.json`
2. Add your entry following the schema in [CONTRIBUTING.md](CONTRIBUTING.md)
3. Open a PR — that's it!

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## 💡 Use Cases

- 🚦 **CI/CD gates** — Block Friday deploys with a risk score threshold
- 🤖 **Slack/Discord bots** — Post daily deploy risk to your team channel
- 🏷️ **README badges** — Show real-time deploy risk in your project
- 😂 **Team morale** — Start standups with "today's deploy risk is..."
- 📊 **Dashboard widgets** — Add to your monitoring dashboard
- 🎓 **Onboarding** — Teach new engineers about deployment best practices (with humor)

---

## 💥 Famous Deployment Disasters

The API includes 50+ real deployment incidents from companies like GitLab, AWS, Facebook, CrowdStrike, Knight Capital, and more. Each incident includes a summary, lesson learned, and severity rating.

```http
GET /incidents/random
```

_Know a famous deployment disaster we're missing? [Submit it!](https://github.com/atryx/deploy-or-regret/issues/new?template=new-incident.md)_

---

## 🌍 Projects Using Deploy-or-Regret

_Be the first!_ If you're using this API in your project, [open a PR](https://github.com/atryx/deploy-or-regret/pulls) to be featured here.

1. **[Your Project Here?](https://github.com/YOUR_REPO)** — Open a PR to be featured!

---

## ⭐ Star History

<a href="https://star-history.com/#atryx/deploy-or-regret&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=atryx/deploy-or-regret&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=atryx/deploy-or-regret&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=atryx/deploy-or-regret&type=Date" />
  </picture>
</a>

---

## 👤 Author

Created with deployment anxiety by [atryx](https://github.com/atryx)

---

## 📄 License

MIT — do whatever, just don't deploy on Friday.
