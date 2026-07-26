import request from 'supertest';
import type { ApiErrorResponse } from '@starter/types';

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

/** A db whose query methods throw — proves validation runs before any DB access. */
const explodingDb = new Proxy(
  {},
  {
    get() {
      throw new Error('database should not be touched for invalid requests');
    },
  },
) as unknown as Database;

/** A db that returns an empty company list (and empty active-employee counts). */
const listingDb = {
  select: () => ({
    from: () => ({
      orderBy: () => Promise.resolve([]),
      where: () => ({ groupBy: () => Promise.resolve([]) }),
    }),
  }),
} as unknown as Database;

describe('companies routes', () => {
  it('lists companies wrapped in an envelope', async () => {
    const response = await request(createApp(env, { db: listingDb })).get('/api/companies');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ companies: [] });
  });

  it('rejects an empty create payload before touching the database', async () => {
    const response = await request(createApp(env, { db: explodingDb }))
      .post('/api/companies')
      .send({});

    const body = response.body as ApiErrorResponse;
    expect(response.status).toBe(400);
    expect(body.error.message).toBe('Invalid request');
    expect(Array.isArray(body.error.issues)).toBe(true);
    expect(body.error.issues?.length).toBeGreaterThan(0);
  });

  it('rejects a create payload with an invalid email', async () => {
    const response = await request(createApp(env, { db: explodingDb }))
      .post('/api/companies')
      .send({
        name: 'Acme',
        industry: 'Manufacturing',
        employeeCount: 10,
        address: '1 Road',
        trn: '100',
        nis: 'NIS-1',
        email: 'not-an-email',
        members: [],
      });

    expect(response.status).toBe(400);
  });

  it('rejects a non-uuid company id', async () => {
    const response = await request(createApp(env, { db: explodingDb })).get('/api/companies/abc');

    expect(response.status).toBe(400);
  });
});

describe('employees routes', () => {
  it('rejects listing employees for a non-uuid company id', async () => {
    const response = await request(createApp(env, { db: explodingDb })).get(
      '/api/companies/not-a-uuid/employees',
    );

    expect(response.status).toBe(400);
  });

  it('rejects creating an employee with a missing name', async () => {
    const response = await request(createApp(env, { db: explodingDb }))
      .post('/api/companies/123e4567-e89b-12d3-a456-426614174000/employees')
      .send({ role: 'Manager', trn: '1', nis: '2', salary: 100, status: 'Active' });

    expect(response.status).toBe(400);
  });
});
