import { Router } from 'express';
import orderRouter from './order';
import productRouter from './product';

const router = Router();

router.use(productRouter);
router.use(orderRouter);

export default router;
