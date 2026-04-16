const {
  assessRisk,
  getRiskLevel,
  getDayScore,
  getTimeScore,
  getSpecialDateScore,
  getDateInTimezone,
} = require('../src/risk-engine');

describe('getDayScore', () => {
  it('returns 70 for Friday', () => {
    expect(getDayScore('Friday')).toBe(70);
  });

  it('returns 15 for Tuesday', () => {
    expect(getDayScore('Tuesday')).toBe(15);
  });

  it('returns 15 for Wednesday', () => {
    expect(getDayScore('Wednesday')).toBe(15);
  });

  it('returns 15 for Thursday', () => {
    expect(getDayScore('Thursday')).toBe(15);
  });

  it('returns 35 for Monday', () => {
    expect(getDayScore('Monday')).toBe(35);
  });

  it('returns 50 for Saturday', () => {
    expect(getDayScore('Saturday')).toBe(50);
  });

  it('returns 50 for Sunday', () => {
    expect(getDayScore('Sunday')).toBe(50);
  });
});

describe('getTimeScore', () => {
  it('returns 10 for before 9am', () => {
    expect(getTimeScore(7)).toBe(10);
  });

  it('returns 0 for 9am-12pm', () => {
    expect(getTimeScore(10)).toBe(0);
  });

  it('returns 15 for lunch hour', () => {
    expect(getTimeScore(12)).toBe(15);
  });

  it('returns 5 for 1pm-4pm', () => {
    expect(getTimeScore(14)).toBe(5);
  });

  it('returns 25 for 4pm-5pm', () => {
    expect(getTimeScore(16)).toBe(25);
  });

  it('returns 35 for after 5pm', () => {
    expect(getTimeScore(18)).toBe(35);
  });
});

describe('getSpecialDateScore', () => {
  it('adds 30 for Friday the 13th', () => {
    const result = getSpecialDateScore(6, 13, 'Friday');
    expect(result.score).toBe(30);
    expect(result.factors).toContain('friday-13th');
  });

  it('adds 50 for holiday freeze (Dec 25)', () => {
    const result = getSpecialDateScore(12, 25, 'Wednesday');
    expect(result.score).toBe(50);
    expect(result.factors).toContain('holiday-freeze');
  });

  it('adds 50 for holiday freeze (Jan 1)', () => {
    const result = getSpecialDateScore(1, 1, 'Wednesday');
    expect(result.score).toBe(50);
    expect(result.factors).toContain('holiday-freeze');
  });

  it('adds 25 for quarter end (Mar 31)', () => {
    const result = getSpecialDateScore(3, 31, 'Monday');
    expect(result.score).toBe(25);
    expect(result.factors).toContain('quarter-end');
  });

  it('adds 25 for quarter end (Jun 30)', () => {
    const result = getSpecialDateScore(6, 30, 'Monday');
    expect(result.score).toBe(25);
    expect(result.factors).toContain('quarter-end');
  });

  it('adds 20 for April Fools', () => {
    const result = getSpecialDateScore(4, 1, 'Tuesday');
    expect(result.score).toBe(20);
    expect(result.factors).toContain('april-fools');
  });

  it('stacks holiday freeze and quarter end for Dec 31', () => {
    const result = getSpecialDateScore(12, 31, 'Tuesday');
    expect(result.score).toBe(75);
    expect(result.factors).toContain('holiday-freeze');
    expect(result.factors).toContain('quarter-end');
  });

  it('returns 0 for a normal date', () => {
    const result = getSpecialDateScore(5, 15, 'Wednesday');
    expect(result.score).toBe(0);
    expect(result.factors).toHaveLength(0);
  });
});

describe('getRiskLevel', () => {
  it('returns LOW for score 0-25', () => {
    expect(getRiskLevel(0)).toBe('LOW');
    expect(getRiskLevel(25)).toBe('LOW');
  });

  it('returns MODERATE for score 26-50', () => {
    expect(getRiskLevel(26)).toBe('MODERATE');
    expect(getRiskLevel(50)).toBe('MODERATE');
  });

  it('returns HIGH for score 51-75', () => {
    expect(getRiskLevel(51)).toBe('HIGH');
    expect(getRiskLevel(75)).toBe('HIGH');
  });

  it('returns CRITICAL for score 76-100', () => {
    expect(getRiskLevel(76)).toBe('CRITICAL');
    expect(getRiskLevel(100)).toBe('CRITICAL');
  });
});

describe('getDateInTimezone', () => {
  it('returns an object with required fields', () => {
    const date = getDateInTimezone('UTC');
    expect(date).toHaveProperty('weekday');
    expect(date).toHaveProperty('hour');
    expect(date).toHaveProperty('month');
    expect(date).toHaveProperty('day');
    expect(date).toHaveProperty('year');
  });

  it('accepts timezone parameter', () => {
    const date = getDateInTimezone('America/New_York');
    expect(date).toHaveProperty('weekday');
    expect(typeof date.hour).toBe('number');
  });

  it('defaults to UTC when no timezone given', () => {
    const date = getDateInTimezone();
    expect(date).toHaveProperty('weekday');
  });
});

describe('assessRisk', () => {
  it('returns all required fields', () => {
    const result = assessRisk();
    expect(result).toHaveProperty('shouldDeploy');
    expect(result).toHaveProperty('riskLevel');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('factors');
    expect(result).toHaveProperty('reason');
    expect(result).toHaveProperty('incident');
    expect(result).toHaveProperty('advice');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('timezone');
  });

  it('returns a score between 0 and 100', () => {
    const result = assessRisk();
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('returns a valid risk level', () => {
    const result = assessRisk();
    expect(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']).toContain(result.riskLevel);
  });

  it('returns shouldDeploy as boolean', () => {
    const result = assessRisk();
    expect(typeof result.shouldDeploy).toBe('boolean');
  });

  it('returns factors as an array', () => {
    const result = assessRisk();
    expect(Array.isArray(result.factors)).toBe(true);
  });

  it('returns an incident with title, summary, and lesson', () => {
    const result = assessRisk();
    expect(result.incident).toHaveProperty('title');
    expect(result.incident).toHaveProperty('summary');
    expect(result.incident).toHaveProperty('lesson');
  });

  it('accepts timezone parameter', () => {
    const result = assessRisk('America/New_York');
    expect(result.timezone).toBe('America/New_York');
  });

  it('defaults to UTC timezone', () => {
    const result = assessRisk();
    expect(result.timezone).toBe('UTC');
  });
});
