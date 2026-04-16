# Contributing to Deploy-or-Regret

Thanks for helping engineers make questionable deployment decisions! Here's how to contribute.

## Adding New Content

All content lives in `data/` as JSON files:

### Deployment Reasons (`data/reasons.json`)

```json
{
  "text": "Your witty deployment observation here",
  "riskLevels": ["HIGH", "CRITICAL"],
  "factors": ["friday", "after-hours"]
}
```

- **`riskLevels`** — when this reason should appear (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`)
- **`factors`** — related risk factors (see `data/factors.json` for valid IDs)

### Famous Incidents (`data/incidents.json`)

```json
{
  "title": "Company Name Incident (Year)",
  "summary": "What happened, in 1-2 sentences.",
  "lesson": "The takeaway, ideally funny.",
  "year": 2024,
  "severity": "catastrophic"
}
```

- **`severity`** — one of `moderate`, `major`, or `catastrophic`
- Prefer real, publicly documented incidents with verifiable details

### Deployment Advice (`data/advice.json`)

```json
{
  "text": "Your sage deployment advice here",
  "riskLevels": ["MODERATE", "HIGH"]
}
```

### Risk Factors (`data/factors.json`)

```json
{
  "id": "factor-id",
  "name": "Human Readable Name",
  "weight": 20,
  "description": "A short, witty explanation."
}
```

## Running Locally

```bash
npm install   # install dependencies
npm start     # start the dev server
npm test      # run the test suite
```

## Pull Request Guidelines

- **One category per PR is perfectly fine.** Small PRs are easy to review.
- **Keep it funny but accurate.** Incidents should be real; humor should be kind.
- **Make sure your JSON parses.** Run `npm test` before pushing — broken JSON will fail CI.
- Descriptive PR titles help, e.g. *"Add 5 new Friday deploy reasons"*.

## Code of Conduct

Be kind. Keep it PG-13. We're here to make people laugh about deployments, not to make anyone uncomfortable. Offensive, discriminatory, or mean-spirited content will be removed.

---

Happy contributing! 🚨
