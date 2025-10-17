import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  res.status(500).json({
    message: err.message || 'Internal server error',
    status: 500,
  });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    message: 'Route not found',
    status: 404,
  });
};
