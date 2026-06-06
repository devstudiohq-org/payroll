import request from 'supertest';

import { createApp } from '../src/app';
import type { AppEnv } from '../src/lib/env';

const env: AppEnv = {
  NODE_ENV: 'test',
  PORT: 4000,
  API_PREFIX: '/api',
  DATABASE_URL: 'postgres://starter:starter@localhost:5432/starter_db',
};

describe('GET /api/health', () => {
  it('returns the placeholder health response', async () => {
    const response = await request(createApp(env)).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      service: 'api',
      status: 'ok',
    });
  });

  it('accepts the detailed query flag', async () => {
    const response = await request(createApp(env)).get('/api/health?detailed=true');
    const body = response.body as { nodeEnv?: string };

    expect(response.status).toBe(200);
    expect(body.nodeEnv).toBe('test');
  });
});
