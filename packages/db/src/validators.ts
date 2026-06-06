import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { appMetadata } from './schema';

export const appMetadataInsertSchema = createInsertSchema(appMetadata);
export const appMetadataSelectSchema = createSelectSchema(appMetadata);
