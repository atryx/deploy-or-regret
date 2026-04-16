const request = require('supertest');
const app = require('../src/app');

describe('GET /deploy', () => {
  it('returns a valid risk assessment with all fields', async () => {
    const res = await request(app).get('/deploy');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('shouldDeploy');
    expect(res.body).toHaveProperty('riskLevel');
    expect(res.body).toHaveProperty('score');
    expect(res.body).toHaveProperty('factors');
    expect(res.body).toHaveProperty('reason');
    expect(res.body).toHaveProperty('incident');
    expect(res.body).toHaveProperty('advice');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('timezone');
    expect(typeof res.body.shouldDeploy).toBe('boolean');
    expect(typeof res.body.score).toBe('number');
    expect(typeof res.body.reason).toBe('string');
    expect(typeof res.body.advice).toBe('string');
  });

  it('accepts tz query parameter', async () => {
    const res = await request(app).get('/deploy?tz=America/New_York');
    expect(res.status).toBe(200);
    expect(res.body.timezone).toBe('America/New_York');
  });

  it('returns 400 for invalid timezone', async () => {
    const res = await request(app).get('/deploy?tz=Invalid/Zone');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /deploy/badge', () => {
  it('returns SVG content', async () => {
    const res = await request(app).get('/deploy/badge').buffer(true).parse((res, cb) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => cb(null, data));
    });
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('image/svg+xml');
    expect(res.body).toContain('<svg');
    expect(res.body).toContain('Deploy Risk');
  });

  it('returns no-cache headers', async () => {
    const res = await request(app).get('/deploy/badge');
    expect(res.headers['cache-control']).toContain('no-cache');
  });

  it('accepts tz query parameter', async () => {
    const res = await request(app).get('/deploy/badge?tz=Europe/Bucharest').buffer(true).parse((res, cb) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => cb(null, data));
    });
    expect(res.status).toBe(200);
    expect(res.body).toContain('<svg');
  });
});

describe('GET /incidents/random', () => {
  it('returns an incident with title, summary, and lesson', async () => {
    const res = await request(app).get('/incidents/random');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('summary');
    expect(res.body).toHaveProperty('lesson');
    expect(typeof res.body.title).toBe('string');
    expect(typeof res.body.summary).toBe('string');
    expect(typeof res.body.lesson).toBe('string');
  });

  it('returns severity and year', async () => {
    const res = await request(app).get('/incidents/random');
    expect(res.body).toHaveProperty('year');
    expect(res.body).toHaveProperty('severity');
  });
});

describe('GET /health', () => {
  it('returns ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /meta', () => {
  it('returns factors and risk levels', async () => {
    const res = await request(app).get('/meta');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.factors)).toBe(true);
    expect(Array.isArray(res.body.riskLevels)).toBe(true);
    expect(res.body.factors.length).toBeGreaterThan(0);
    expect(res.body.riskLevels).toContain('LOW');
    expect(res.body.riskLevels).toContain('CRITICAL');
  });

  it('returns factor objects with id and name', async () => {
    const res = await request(app).get('/meta');
    const factor = res.body.factors[0];
    expect(factor).toHaveProperty('id');
    expect(factor).toHaveProperty('name');
    expect(factor).toHaveProperty('weight');
    expect(factor).toHaveProperty('description');
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
