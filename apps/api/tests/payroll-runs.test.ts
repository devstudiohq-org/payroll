import request from 'supertest';

import { createApp } from '../src/app';

import type { Database } from '../src/lib/db';
import type { AppEnv } from '../src/lib/env';

const env: AppEnv = {
  NODE_ENV: 'test',
  PORT: 4000,
  API_PREFIX: '/api',
  DATABASE_URL: 'postgres://starter:starter@localhost:5432/starter_db',
  CORS_ORIGINS: [],
};

const explodingDb = new Proxy(
  {},
  {
    get() {
      throw new Error('database should not be touched for invalid requests');
    },
  },
) as unknown as Database;

const listingDb = {
  select: () => ({
    from: () => ({
      where: () => ({
        orderBy: () => Promise.resolve([]),
      }),
    }),
  }),
} as unknown as Database;

describe('payroll runs routes', () => {
  it('lists payroll runs for a company', async () => {
    const response = await request(createApp(env, { db: listingDb })).get(
      '/api/companies/123e4567-e89b-12d3-a456-426614174000/payroll-runs',
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ runs: [] });
  });

  it('rejects listing payroll runs for a non-uuid company id', async () => {
    const response = await request(createApp(env, { db: explodingDb })).get(
      '/api/companies/not-a-uuid/payroll-runs',
    );

    expect(response.status).toBe(400);
  });

  it('rejects creating a payroll run with missing parameters', async () => {
    const response = await request(createApp(env, { db: explodingDb }))
      .post('/api/companies/123e4567-e89b-12d3-a456-426614174000/payroll-runs')
      .send({ period: 'June 2026' });

    expect(response.status).toBe(400);
  });

  it('rejects creating a payroll run with invalid numbers', async () => {
    const response = await request(createApp(env, { db: explodingDb }))
      .post('/api/companies/123e4567-e89b-12d3-a456-426614174000/payroll-runs')
      .send({
        period: 'June 2026',
        employeesCount: -1,
        totalGrossPay: 1000,
        totalNetPay: 900,
        totalTax: 50,
        totalNis: 50,
      });

    expect(response.status).toBe(400);
  });
});
