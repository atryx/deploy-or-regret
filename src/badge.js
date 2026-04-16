const COLORS = {
  LOW: '#4c1',
  MODERATE: '#dfb317',
  HIGH: '#fe7d37',
  CRITICAL: '#e05d44',
};

function generateBadge(riskLevel) {
  const color = COLORS[riskLevel] || COLORS.MODERATE;
  const label = 'Deploy Risk';
  const value = riskLevel;
  const labelWidth = 76;
  const valueWidth = riskLevel === 'MODERATE' ? 78 : riskLevel === 'CRITICAL' ? 68 : 42;
  const totalWidth = labelWidth + valueWidth;
  const labelX = labelWidth / 2;
  const valueX = labelWidth + valueWidth / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${labelX}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelX}" y="14" fill="#fff">${label}</text>
    <text x="${valueX}" y="15" fill="#010101" fill-opacity=".3">${value}</text>
    <text x="${valueX}" y="14" fill="#fff">${value}</text>
  </g>
</svg>`;
}

module.exports = { generateBadge };
