import path from 'node:path';

import { config } from 'dotenv';
import { sql } from 'drizzle-orm';

// The seed runs with its cwd at packages/db, so load the repo-root .env explicitly.
config({ path: path.resolve(__dirname, '../../../.env') });



import { createDatabaseClient } from '../src/client';
import {
  appMetadata,
  companies,
  companyMembers,
  employees,
  taxConfigurations,
} from '../src/schema';

/** Base Jamaican statutory tax configuration applied to every company (monthly). */
const BASE_TAX_CONFIG = {
  taxFreeThreshold: '125000.00',
  nisRate: '3.00',
  nhtRate: '2.00',
  edtaxRate: '2.25',
  standardTaxRate: '25.00',
  highEarnerThreshold: '500000.00',
  highEarnerTaxRate: '30.00',
};

const COMPANY_SEED = [
  {
    name: 'Acme Industries',
    industry: 'Manufacturing',
    employeeCount: 24,
    address: '12 Marcus Garvey Drive, Kingston, Jamaica',
    trn: '100123456',
    nis: 'NIS-001-2345',
    email: 'payroll@acme.com',
    members: [{ fullName: 'Bonita Smith', email: 'bonita@acme.com', role: 'Admin' as const }],
    employees: [
      {
        name: 'Marcus Brown',
        role: 'Operations Manager',
        trn: '100777111',
        nis: 'NIS-101-1111',
        salary: '420000.00',
        status: 'Active' as const,
      },
      {
        name: 'Alicia Green',
        role: 'Senior Accountant',
        trn: '100777222',
        nis: 'NIS-101-2222',
        salary: '360000.00',
        status: 'Active' as const,
      },
      {
        name: 'David Clarke',
        role: 'Production Supervisor',
        trn: '100777333',
        nis: 'NIS-101-3333',
        salary: '300000.00',
        status: 'Active' as const,
      },
    ],
  },
  {
    name: 'TechNova Solutions',
    industry: 'Technology',
    employeeCount: 45,
    address: '8 Trafalgar Road, Kingston, Jamaica',
    trn: '100234567',
    nis: 'NIS-002-3456',
    email: 'payroll@technova.com',
    members: [],
    employees: [],
  },
  {
    name: 'Global Retail Corp',
    industry: 'Retail',
    employeeCount: 120,
    address: '45 Constant Spring Road, Kingston, Jamaica',
    trn: '100345678',
    nis: 'NIS-003-4567',
    email: 'payroll@globalretail.com',
    members: [],
    employees: [],
  },
  {
    name: 'Healthcare Plus',
    industry: 'Healthcare',
    employeeCount: 68,
    address: '3 Hope Road, Kingston, Jamaica',
    trn: '100456789',
    nis: 'NIS-004-5678',
    email: 'payroll@healthcareplus.com',
    members: [],
    employees: [],
  },
];

async function seed() {
  const { db, pool } = createDatabaseClient();

  try {
    await db.execute(sql`select 1`);

    await db
      .insert(appMetadata)
      .values({ key: 'starter-shell', value: new Date().toISOString() })
      .onConflictDoUpdate({
        target: appMetadata.key,
        set: { value: new Date().toISOString(), updatedAt: new Date() },
      });

    const existing = await db.select({ id: companies.id }).from(companies).limit(1);
    if (existing.length > 0) {
      console.log('Companies already seeded — skipping company seed');
    } else {
      for (const seed of COMPANY_SEED) {
        const [company] = await db
          .insert(companies)
          .values({
            name: seed.name,
            industry: seed.industry,
            employeeCount: seed.employeeCount,
            address: seed.address,
            trn: seed.trn,
            nis: seed.nis,
            email: seed.email,
          })
          .returning();

        if (!company) continue;

        if (seed.members.length > 0) {
          await db
            .insert(companyMembers)
            .values(seed.members.map((member) => ({ companyId: company.id, ...member })));
        }

        if (seed.employees.length > 0) {
          await db
            .insert(employees)
            .values(seed.employees.map((employee) => ({ companyId: company.id, ...employee })));
        }
      }

      console.log(`Seeded ${COMPANY_SEED.length} companies`);
    }

    // Ensure every company has the base tax configuration (idempotent).
    const allCompanies = await db.select({ id: companies.id }).from(companies);
    if (allCompanies.length > 0) {
      await db
        .insert(taxConfigurations)
        .values(allCompanies.map((company) => ({ companyId: company.id, ...BASE_TAX_CONFIG })))
        .onConflictDoNothing({ target: taxConfigurations.companyId });
      console.log(`Ensured base tax config for ${allCompanies.length} companies`);
    }

    console.log('Seed completed');
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
