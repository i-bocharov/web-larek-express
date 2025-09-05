import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { errors as celebrateErrors } from 'celebrate';
import config from './config';
import mainRouter from './routes';
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
mongoose.connect(config.dbAddress);

// Подключаем главный роутер ко всему приложению
app.use(mainRouter);

// Обработчик ошибок валидации celebrate
app.use(celebrateErrors());

// Централизованный обработчик ошибок
app.use(errorHandler);

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
