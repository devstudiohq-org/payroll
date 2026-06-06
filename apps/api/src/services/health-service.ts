import type { HealthResponse } from '@starter/types';

type HealthSnapshotOptions = {
  detailed: boolean;
  nodeEnv: string;
  startedAt: number;
};

export function getHealthSnapshot(options: HealthSnapshotOptions): HealthResponse {
  return {
    service: 'api',
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round((Date.now() - options.startedAt) / 1000),
    nodeEnv: options.detailed ? options.nodeEnv : undefined,
  };
}
