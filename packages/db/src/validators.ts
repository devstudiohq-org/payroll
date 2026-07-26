import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { appMetadata, employees } from './schema';

export const appMetadataInsertSchema = createInsertSchema(appMetadata);
export const appMetadataSelectSchema = createSelectSchema(appMetadata);

export const employeeInsertSchema = createInsertSchema(employees);
export const employeeSelectSchema = createSelectSchema(employees);

