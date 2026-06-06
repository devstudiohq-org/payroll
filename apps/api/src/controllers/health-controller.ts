import type { RequestHandler } from 'express';

import type { AppEnv } from '../lib/env';
import type { ValidatedRequest } from '../types/http';
import { getHealthSnapshot } from '../services/health-service';

type HealthControllerOptions = {
  env: AppEnv;
  startedAt: number;
};

export function createHealthController(options: HealthControllerOptions): RequestHandler {
  return (req, res) => {
    const query = ((req as ValidatedRequest).validated?.query as { detailed?: boolean } | undefined) ?? {};
    const payload = getHealthSnapshot({
      detailed: query.detailed ?? false,
      nodeEnv: options.env.NODE_ENV,
      startedAt: options.startedAt,
    });

    res.status(200).json(payload);
  };
}
