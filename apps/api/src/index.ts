import 'dotenv/config';

import { createApp } from './app';
import { loadEnv } from './lib/env';
import { logger } from './lib/logger';

const env = loadEnv();
const app = createApp(env);

app.listen(env.PORT, () => {
  logger.info('API server listening', {
    apiPrefix: env.API_PREFIX,
    env: env.NODE_ENV,
    port: env.PORT,
  });
});
