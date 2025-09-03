import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import BadRequestError from '../errors/bad-request-error';

/**
 * Создание заказа
 * @param req - объект запроса
 * @param res - объект ответа
 * @param next - функция для передачи управления следующему middleware
 */
const createOrder = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Логика создания заказа
    const { total } = req.body;
    // Генерация случайного UUID для заказа.
    const orderId = faker.string.uuid();

    return res.status(201).json({
      id: orderId,
      total,
    });
  } catch (error) {
    // Если Mongoose вернул ошибку валидации...
    if (error instanceof mongoose.Error.ValidationError) {
      // ... создаем ошибку 400 и передаем ее в обработчик ошибок
      return next(
        new BadRequestError('Ошибка валидации данных при создании заказа'),
      );
    }

    // Любую непредвиденную ошибку отправляем в обработчик ошибок
    return next(error);
  }
};

export default createOrder;
