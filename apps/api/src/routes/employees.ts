import { Router, type Router as ExpressRouter } from 'express';
import { z } from 'zod';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type * as schema from '@starter/db/schema';
import { validateRequest } from '../middleware/validate-request';
import {
  createListEmployeesController,
  createGetEmployeeController,
  createCreateEmployeeController,
  createBulkCreateEmployeesController,
  createUpdateEmployeeController,
  createDeleteEmployeeController,
} from '../controllers/employee-controller';

type Db = NodePgDatabase<typeof schema>;

type EmployeeRouteOptions = {
  db: Db;
};

const employeeIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const createEmployeeBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  role: z.string().optional().default(''),
  department: z.string().optional().default(''),
  trn: z.string().optional().default(''),
  nis: z.string().optional().default(''),
  salary: z.string().optional().default('0'),
  taxCode: z.string().optional().default('TC01'),
  status: z.string().optional().default('Active'),
  allowances: z.array(z.object({ name: z.string(), amount: z.number() })).optional().default([]),
  deductions: z.array(z.object({ name: z.string(), amount: z.number() })).optional().default([]),
});

const bulkCreateBodySchema = z.object({
  employees: z.array(createEmployeeBodySchema).min(1),
});

const updateEmployeeBodySchema = createEmployeeBodySchema.partial();

export function createEmployeeRouter(options: EmployeeRouteOptions): ExpressRouter {
  const router = Router();

  // List all employees
  router.get('/employees', createListEmployeesController(options));

  // Get single employee
  router.get(
    '/employees/:id',
    validateRequest({ params: employeeIdParamsSchema }),
    createGetEmployeeController(options),
  );

  // Create single employee
  router.post(
    '/employees',
    validateRequest({ body: createEmployeeBodySchema }),
    createCreateEmployeeController(options),
  );

  // Bulk create employees
  router.post(
    '/employees/bulk',
    validateRequest({ body: bulkCreateBodySchema }),
    createBulkCreateEmployeesController(options),
  );

  // Update employee
  router.put(
    '/employees/:id',
    validateRequest({ params: employeeIdParamsSchema, body: updateEmployeeBodySchema }),
    createUpdateEmployeeController(options),
  );

  // Delete employee
  router.delete(
    '/employees/:id',
    validateRequest({ params: employeeIdParamsSchema }),
    createDeleteEmployeeController(options),
  );

  return router;
}
