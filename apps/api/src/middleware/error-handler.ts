import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  void _next;

  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Invalid request',
        issues: error.issues.map((issue) => issue.message),
      },
    });

    return;
  }

  const message = error instanceof Error ? error.message : 'Unexpected error';

  res.status(500).json({
    error: {
      message,
    },
  });
};
