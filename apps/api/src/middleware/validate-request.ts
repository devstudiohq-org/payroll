import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

import type { ValidatedRequest } from '../types/http';

type RequestSchemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (req, _res, next) => {
    try {
      const validatedRequest = req as ValidatedRequest;

      validatedRequest.validated = {
        body: schemas.body ? schemas.body.parse(req.body) : req.body,
        params: schemas.params ? schemas.params.parse(req.params) : req.params,
        query: schemas.query ? schemas.query.parse(req.query) : req.query,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
