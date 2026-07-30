import request from 'supertest';
import type { TaxConfigDto } from '@starter/types';

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

const COMPANY_ID = '123e4567-e89b-12d3-a456-426614174000';

/** A db whose query methods throw — proves validation runs before any DB access. */
const explodingDb = new Proxy(
  {},
  {
    get() {
      throw new Error('database should not be touched for invalid requests');
    },
  },
) as unknown as Database;

/** A db that returns no stored tax config row. */
const emptyDb = {
  select: () => ({
    from: () => ({
      where: () => ({
        limit: () => Promise.resolve([]),
      }),
    }),
  }),
} as unknown as Database;

describe('tax-config routes', () => {
  it('returns a default (isDefault) config when none is stored', async () => {
    const response = await request(createApp(env, { db: emptyDb })).get(
      `/api/companies/${COMPANY_ID}/tax-config`,
    );

    const body = response.body as { config: TaxConfigDto };
    expect(response.status).toBe(200);
    expect(body.config).toMatchObject({
      companyId: COMPANY_ID,
      isDefault: true,
      taxFreeThreshold: 0,
      standardTaxRate: 0,
      nhtRate: 0,
      edtaxRate: 0,
    });
  });

  it('rejects a non-uuid company id on GET', async () => {
    const response = await request(createApp(env, { db: explodingDb })).get(
      '/api/companies/not-a-uuid/tax-config',
    );

    expect(response.status).toBe(400);
  });

  it('rejects a rate above 100 on PUT before touching the database', async () => {
    const response = await request(createApp(env, { db: explodingDb }))
      .put(`/api/companies/${COMPANY_ID}/tax-config`)
      .send({ standardTaxRate: 150 });

    expect(response.status).toBe(400);
  });

  it('rejects a negative threshold on PUT', async () => {
    const response = await request(createApp(env, { db: explodingDb }))
      .put(`/api/companies/${COMPANY_ID}/tax-config`)
      .send({ taxFreeThreshold: -100 });

    expect(response.status).toBe(400);
  });
});
