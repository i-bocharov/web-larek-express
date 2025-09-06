import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import product from '../models/product';

/**
 * Создание заказа
 * @param req - объект запроса
 * @param res - объект ответа
 * @param next - функция для передачи управления следующему middleware
 */
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { total, items } = req.body;

    // Проверяем, что _id существуют в базе
    const products = await product.find({ _id: { $in: items } }).lean();

    // Если количество найденных товаров не совпадает с количеством ID в запросе,
    // значит, какой-то ID недействителен.
    if (products.length !== items.length) {
      return next(
        new NotFoundError(
          'Один или несколько товаров не найдены в базе данных',
        ),
      );
    }

    // Проверяем, что товары продаются, и считаем сумму
    const actualTotal = products.reduce((sum, productItem) => {
      if (productItem.price === null) {
        // Выбрасываем ошибку, если товар недоступен
        throw new BadRequestError(
          `Товар "${productItem.title}" недоступен для покупки (цена не указана)`,
        );
      }
      return sum + (productItem.price ?? 0);
    }, 0);

    // Проверяем, что стоимость переданных товаров в сумме равна total
    if (actualTotal !== total) {
      return next(
        new BadRequestError(
          `Сумма заказа не совпадает: ожидается ${actualTotal}, получено ${total}`,
        ),
      );
    }

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
