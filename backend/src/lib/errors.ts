export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class DuplicateResourceError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.name = 'DuplicateResourceError';
  }
}

export class AiServiceError extends AppError {
  constructor(message = 'AI service failed') {
    super(message, 500);
    this.name = 'AiServiceError';
  }
}
