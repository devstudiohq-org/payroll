import type { RequestHandler } from 'express';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type * as schema from '@starter/db/schema';
import type { ValidatedRequest } from '../types/http';
import {
  listEmployees,
  getEmployee,
  createEmployee,
  createEmployeesBulk,
  updateEmployee,
  deleteEmployee,
  type EmployeeInput,
} from '../services/employee-service';

type Db = NodePgDatabase<typeof schema>;

type EmployeeControllerOptions = {
  db: Db;
};

export function createListEmployeesController({ db }: EmployeeControllerOptions): RequestHandler {
  return async (_req, res, next) => {
    try {
      const employees = await listEmployees(db);
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  };
}

export function createGetEmployeeController({ db }: EmployeeControllerOptions): RequestHandler {
  return async (req, res, next) => {
    try {
      const { id } = (req as ValidatedRequest).validated?.params as { id: number };
      const employee = await getEmployee(db, id);

      if (!employee) {
        res.status(404).json({ error: { message: 'Employee not found' } });
        return;
      }

      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  };
}

export function createCreateEmployeeController({ db }: EmployeeControllerOptions): RequestHandler {
  return async (req, res, next) => {
    try {
      const body = (req as ValidatedRequest).validated?.body as EmployeeInput;
      const employee = await createEmployee(db, body);
      res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  };
}

export function createBulkCreateEmployeesController({ db }: EmployeeControllerOptions): RequestHandler {
  return async (req, res, next) => {
    try {
      const body = (req as ValidatedRequest).validated?.body as { employees: EmployeeInput[] };
      const employees = await createEmployeesBulk(db, body.employees);
      res.status(201).json(employees);
    } catch (error) {
      next(error);
    }
  };
}

export function createUpdateEmployeeController({ db }: EmployeeControllerOptions): RequestHandler {
  return async (req, res, next) => {
    try {
      const { id } = (req as ValidatedRequest).validated?.params as { id: number };
      const body = (req as ValidatedRequest).validated?.body as Partial<EmployeeInput>;
      const employee = await updateEmployee(db, id, body);

      if (!employee) {
        res.status(404).json({ error: { message: 'Employee not found' } });
        return;
      }

      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  };
}

export function createDeleteEmployeeController({ db }: EmployeeControllerOptions): RequestHandler {
  return async (req, res, next) => {
    try {
      const { id } = (req as ValidatedRequest).validated?.params as { id: number };
      const employee = await deleteEmployee(db, id);

      if (!employee) {
        res.status(404).json({ error: { message: 'Employee not found' } });
        return;
      }

      res.status(200).json({ message: 'Employee deleted', employee });
    } catch (error) {
      next(error);
    }
  };
}
