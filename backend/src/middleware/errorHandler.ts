import { Prisma } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/errors.js';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err instanceof AppError ? err.statusCode : err?.statusCode ?? 500;

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    res.status(409).json({
      success: false,
      message: 'A product with this name already exists'
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    res.status(404).json({
      success: false,
      message: 'Product not found'
    });
    return;
  }

  if (statusCode >= 500) {
    console.error('Unhandled server error:', err);
  }

  const message = statusCode >= 500 ? 'Internal server error' : err?.message || 'Request failed';

  res.status(statusCode).json({
    success: false,
    message
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
}
