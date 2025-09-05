import { Router } from 'express';
import createOrder from '../controllers/order';
import createOrderValidator from '../middlewares/validation';

const orderRouter = Router();

orderRouter.post('/order', createOrderValidator, createOrder);

export default orderRouter;
