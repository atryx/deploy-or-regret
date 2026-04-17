function pickRandom(arr) {
  if (!arr || arr.length === 0) {
    throw new Error('pickRandom called with empty array');
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

function filterByRiskLevel(items, riskLevel) {
  if (!riskLevel) return items;

  const filtered = items.filter(
    (item) => !item.riskLevels || item.riskLevels.includes(riskLevel),
  );
  return filtered.length > 0 ? filtered : items;
}

function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = { pickRandom, filterByRiskLevel, clampScore };
