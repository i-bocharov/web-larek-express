import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { errors as celebrateErrors } from 'celebrate';
import config from './config';
import mainRouter from './routes';
import { requestLogger, errorLogger, logger } from './middlewares/logger';
import errorHandler from './middlewares/error-handler';

const PORT = config.port;

const app = express();

// Подключаем middleware для раздачи статических файлов из папки 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Подключаем middleware для парсинга тел запросов
// Парсер для JSON (Content-Type: application/json)
app.use(express.json());
// Парсер для URL-encoded данных (Content-Type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Подключаемся к серверу MongoDB
mongoose
  .connect(config.dbAddress)
  .then(() => {
    logger.info('Successfully connected to MongoDB');
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', err);
  });

// Логирование входящих запросов (до роутов)
app.use(requestLogger);

// Подключаем главный роутер ко всему приложению
app.use(mainRouter);

// Логирование ошибок (после роутов и перед обработчиком ошибок)
app.use(errorLogger);

// Обработчик ошибок валидации celebrate
app.use(celebrateErrors());

// Централизованный обработчик ошибок
app.use(errorHandler);

// Запускаем сервер
app.listen(PORT, () => {
  logger.info(`App listening on port ${PORT}`);
});
