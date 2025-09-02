import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import product from '../models/product';

/**
 * Получение всех товаров
 * @param _req - объект запроса
 * @param res - объект ответа
 * @param next - функция для передачи управления следующему middleware
 */
export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Получаем все товары из базы данных
    const products = await product.find({});

    // 2. Формируем итоговый объект ответа в нужном формате
    //    - "items" будет содержать массив товаров
    //    - "total" будет содержать их количество
    const response = {
      items: products,
      total: products.length,
    };

    return res.status(200).send(response);
  } catch (error) {
    // Любую непредвиденную ошибку отправляем в обработчик ошибок
    return next(error);
  }
};

/**
 * Создание товара
 * @param req - объект запроса
 * @param res - объект ответа
 * @param next - функция для передачи управления следующему middleware
 */
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newProduct = await product.create(req.body);

    return res.status(201).send(newProduct);
  } catch (error) {
    // Если Mongoose вернул ошибку валидации...
    if (error instanceof mongoose.Error.ValidationError) {
      // ... создаем ошибку 400 и передаем ее в обработчик ошибок
      return next(
        new BadRequestError('Ошибка валидации данных при создании товара'),
      );
    }

    // Если MongoDB вернула ошибку дубликата...
    if (error instanceof Error && error.message.includes('E11000')) {
      // ... создаем ошибку 400 и передаем ее в обработчик ошибок
      return next(new ConflictError('Товар с таким названием уже существует'));
    }

    // Любую непредвиденную ошибку отправляем в обработчик ошибок
    return next(error);
  }
};
