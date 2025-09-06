import { Request, Response, NextFunction } from 'express';
import BaseError from '../errors/base-error';

// Централизованный обработчик ошибок
export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Если это наше пользовательское исключение с кодом — возвращаем его
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Если это Error или объект с полями status/statusCode/message
  if (err && typeof err === 'object') {
    const maybeErr = err as Partial<Record<string, unknown>>;
    const status = maybeErr.statusCode || maybeErr.status || 500;
    const message = maybeErr.message || 'Internal Server Error';
    return res.status(status as number).json({ message });
  }

  // Фолбэк
  return res.status(500).json({ message: 'Internal Server Error' });
}
