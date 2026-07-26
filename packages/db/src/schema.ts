import { pgTable, text, timestamp, serial, numeric, jsonb } from 'drizzle-orm/pg-core';

export const appMetadata = pgTable('app_metadata', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type AppMetadata = typeof appMetadata.$inferSelect;
export type NewAppMetadata = typeof appMetadata.$inferInsert;

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().default(''),
  startDate: text('start_date').notNull().default(''),
  role: text('role').notNull().default(''),
  department: text('department').notNull().default(''),
  trn: text('trn').notNull().default(''),
  nis: text('nis').notNull().default(''),
  salary: numeric('salary', { precision: 12, scale: 2 }).notNull().default('0'),
  taxCode: text('tax_code').notNull().default('TC01'),
  status: text('status').notNull().default('Active'),
  allowances: jsonb('allowances').notNull().default([]),
  deductions: jsonb('deductions').notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
