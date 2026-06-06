import { Router, type Router as ExpressRouter } from 'express';
import { z } from 'zod';

import type { AppEnv } from '../lib/env';
import { createHealthController } from '../controllers/health-controller';
import { validateRequest } from '../middleware/validate-request';

const healthQuerySchema = z.object({
  detailed: z.coerce.boolean().optional(),
});

type HealthRouteOptions = {
  env: AppEnv;
  startedAt: number;
};

export function createHealthRouter(options: HealthRouteOptions): ExpressRouter {
  const router = Router();

  router.get(
    '/health',
    validateRequest({ query: healthQuerySchema }),
    createHealthController(options),
  );

  return router;
}
