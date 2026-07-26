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

  it('rejects creating a payroll run without a period', async () => {
    const response = await request(createApp(env, { db: explodingDb }))
      .post('/api/companies/123e4567-e89b-12d3-a456-426614174000/payroll-runs')
      .send({});

    expect(response.status).toBe(400);
  });

  it('rejects an invalid status', async () => {
    const response = await request(createApp(env, { db: explodingDb }))
      .post('/api/companies/123e4567-e89b-12d3-a456-426614174000/payroll-runs')
      .send({ period: 'June 2026', status: 'Nonsense' });

    expect(response.status).toBe(400);
  });
});

describe('payslips route', () => {
  it('lists stored payslip lines for a run', async () => {
    const response = await request(createApp(env, { db: listingDb })).get(
      '/api/companies/123e4567-e89b-12d3-a456-426614174000/payroll-runs/223e4567-e89b-12d3-a456-426614174000/payslips',
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ lines: [] });
  });

  it('rejects a non-uuid run id', async () => {
    const response = await request(createApp(env, { db: explodingDb })).get(
      '/api/companies/123e4567-e89b-12d3-a456-426614174000/payroll-runs/not-a-uuid/payslips',
    );

    expect(response.status).toBe(400);
  });
});
