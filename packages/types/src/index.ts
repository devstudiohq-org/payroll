export interface HealthResponse {
  service: 'api';
  status: 'ok';
  timestamp: string;
  uptimeSeconds: number;
  nodeEnv?: string;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    issues?: string[];
  };
}
