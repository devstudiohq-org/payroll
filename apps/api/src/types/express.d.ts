import 'express-serve-static-core';

import type { ValidatedRequestState } from './http';

declare module 'express-serve-static-core' {
  interface Request {
    validated?: ValidatedRequestState;
  }
}
