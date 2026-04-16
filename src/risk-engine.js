const { pickRandom, filterByRiskLevel, clampScore } = require('./utils');
const reasons = require('../data/reasons.json');
const incidents = require('../data/incidents.json');
const advice = require('../data/advice.json');

const RISK_LEVELS = {
  LOW: { label: 'LOW', color: 'green', threshold: 25 },
  MODERATE: { label: 'MODERATE', color: 'yellow', threshold: 50 },
  HIGH: { label: 'HIGH', color: 'orange', threshold: 75 },
  CRITICAL: { label: 'CRITICAL', color: 'red', threshold: 100 },
};

function getDateInTimezone(tz) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz || 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
    hour12: false,
  });

  const parts = {};
  for (const { type, value } of formatter.formatToParts(now)) {
    parts[type] = value;
  }

  return {
    weekday: parts.weekday,
    hour: parseInt(parts.hour, 10),
    month: parseInt(parts.month, 10),
    day: parseInt(parts.day, 10),
    year: parseInt(parts.year, 10),
  };
}

function getDayScore(weekday) {
  const scores = {
    Monday: 35,
    Tuesday: 15,
    Wednesday: 15,
    Thursday: 15,
    Friday: 70,
    Saturday: 50,
    Sunday: 50,
  };
  return scores[weekday] || 15;
}

function getTimeScore(hour) {
  if (hour < 9) return 10;
  if (hour < 12) return 0;
  if (hour < 13) return 15;
  if (hour < 16) return 5;
  if (hour < 17) return 25;
  return 35;
}

function getSpecialDateScore(month, day, weekday) {
  let score = 0;
  const factors = [];

  // Friday the 13th
  if (weekday === 'Friday' && day === 13) {
    score += 30;
    factors.push('friday-13th');
  }

  // Holiday freeze: Dec 23 - Jan 2
  if ((month === 12 && day >= 23) || (month === 1 && day <= 2)) {
    score += 50;
    factors.push('holiday-freeze');
  }

  // Last day of quarter
  if (
    (month === 3 && day === 31) ||
    (month === 6 && day === 30) ||
    (month === 9 && day === 30) ||
    (month === 12 && day === 31)
  ) {
    score += 25;
    factors.push('quarter-end');
  }

  // April Fools
  if (month === 4 && day === 1) {
    score += 20;
    factors.push('april-fools');
  }

  return { score, factors };
}

function getRiskLevel(score) {
  if (score <= RISK_LEVELS.LOW.threshold) return 'LOW';
  if (score <= RISK_LEVELS.MODERATE.threshold) return 'MODERATE';
  if (score <= RISK_LEVELS.HIGH.threshold) return 'HIGH';
  return 'CRITICAL';
}

function getActiveFactors(weekday, hour, specialFactors) {
  const factors = [];

  if (weekday === 'Friday') factors.push('friday');
  if (weekday === 'Saturday' || weekday === 'Sunday') factors.push('weekend');
  if (weekday === 'Monday') factors.push('monday');

  if (hour < 9) factors.push('before-coffee');
  if (hour >= 12 && hour < 13) factors.push('lunch-deploy');
  if (hour >= 16 && hour < 17) factors.push('end-of-day');
  if (hour >= 17) factors.push('after-hours');

  return [...factors, ...specialFactors];
}

function assessRisk(tz) {
  const date = getDateInTimezone(tz);

  const dayScore = getDayScore(date.weekday);
  const timeScore = getTimeScore(date.hour);
  const special = getSpecialDateScore(date.month, date.day, date.weekday);
  const chaosScore = Math.floor(Math.random() * 11);

  const rawScore = dayScore + timeScore + special.score + chaosScore;
  const score = clampScore(rawScore);
  const riskLevel = getRiskLevel(score);
  const shouldDeploy = score <= 50;

  const activeFactors = getActiveFactors(date.weekday, date.hour, special.factors);

  const reasonPool = filterByRiskLevel(reasons, riskLevel);
  const advicePool = filterByRiskLevel(advice, riskLevel);

  return {
    shouldDeploy,
    riskLevel,
    score,
    factors: activeFactors,
    reason: pickRandom(reasonPool).text,
    incident: pickRandom(incidents),
    advice: pickRandom(advicePool).text,
    timestamp: new Date().toISOString(),
    timezone: tz || 'UTC',
  };
}

module.exports = {
  assessRisk,
  getRiskLevel,
  getDayScore,
  getTimeScore,
  getSpecialDateScore,
  getDateInTimezone,
  RISK_LEVELS,
};
