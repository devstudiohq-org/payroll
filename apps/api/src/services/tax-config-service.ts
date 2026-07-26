import type { TaxConfigDto } from '@starter/types';
import {
  taxConfigurations,
  type TaxConfiguration,
  type UpsertTaxConfigInput,
} from '@starter/db';
import { eq } from 'drizzle-orm';

import type { Database } from '../lib/db';

function toDto(row: TaxConfiguration): TaxConfigDto {
  return {
    companyId: row.companyId,
    taxFreeThreshold: Number(row.taxFreeThreshold),
    nisRate: Number(row.nisRate),
    nhtRate: Number(row.nhtRate),
    edtaxRate: Number(row.edtaxRate),
    standardTaxRate: Number(row.standardTaxRate),
    highEarnerThreshold: Number(row.highEarnerThreshold),
    highEarnerTaxRate: Number(row.highEarnerTaxRate),
    isDefault: false,
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** An all-zero configuration, used when a company has not saved one yet. */
function defaultConfig(companyId: string): TaxConfigDto {
  return {
    companyId,
    taxFreeThreshold: 0,
    nisRate: 0,
    nhtRate: 0,
    edtaxRate: 0,
    standardTaxRate: 0,
    highEarnerThreshold: 0,
    highEarnerTaxRate: 0,
    isDefault: true,
    updatedAt: null,
  };
}

export async function getTaxConfig(db: Database, companyId: string): Promise<TaxConfigDto> {
  const [row] = await db
    .select()
    .from(taxConfigurations)
    .where(eq(taxConfigurations.companyId, companyId))
    .limit(1);

  return row ? toDto(row) : defaultConfig(companyId);
}

export async function upsertTaxConfig(
  db: Database,
  companyId: string,
  input: UpsertTaxConfigInput,
): Promise<TaxConfigDto> {
  const values = {
    companyId,
    taxFreeThreshold: input.taxFreeThreshold.toFixed(2),
    nisRate: input.nisRate.toFixed(2),
    nhtRate: input.nhtRate.toFixed(2),
    edtaxRate: input.edtaxRate.toFixed(2),
    standardTaxRate: input.standardTaxRate.toFixed(2),
    highEarnerThreshold: input.highEarnerThreshold.toFixed(2),
    highEarnerTaxRate: input.highEarnerTaxRate.toFixed(2),
  };

  const [row] = await db
    .insert(taxConfigurations)
    .values(values)
    .onConflictDoUpdate({
      target: taxConfigurations.companyId,
      set: { ...values, updatedAt: new Date() },
    })
    .returning();

  if (!row) {
    throw new Error('Failed to save tax configuration');
  }

  return toDto(row);
}
