import type { NextFunction, Request, Response } from 'express';
import { ZodError, type AnyZodObject } from 'zod';
import { ValidationError } from '../lib/errors.js';

export function validateSchema(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError(error.issues.map((issue) => issue.message).join(', ')));
        return;
      }

      next(error);
    }
  };
}

export function validateRequestParams(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError(error.issues.map((issue) => issue.message).join(', ')));
        return;
      }

      next(error);
    }
  };
}
