import { fileURLToPath } from 'node:url';

import { createBaseConfig } from './packages/config/eslint/base.mjs';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default createBaseConfig({ rootDir });
