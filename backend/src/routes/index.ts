import { NextFunction, Request, Response, Router } from 'express';
import orderRouter from './order';
import productRouter from './product';
import NotFoundError from '../errors/not-found-error';

const router = Router();

router.use(productRouter);
router.use(orderRouter);
// 404 для несуществующих маршрутов
router.use('*', (_req: Request, _res: Response, next: NextFunction) =>
  next(new NotFoundError('Маршрут не найден')),
);

export default router;
