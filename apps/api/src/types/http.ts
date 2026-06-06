import type { Request } from 'express';

export type ValidatedRequestState = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

export type ValidatedRequest = Request & {
  validated?: ValidatedRequestState;
};
