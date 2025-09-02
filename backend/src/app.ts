import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routes/product';

const { PORT = 3000 } = process.env;

const app = express();

// Подключаем middleware для парсинга тел запросов
// Парсер для JSON (Content-Type: application/json)
app.use(express.json());
// Парсер для URL-encoded данных (Content-Type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Подключаемся к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/weblarek');

// Импортируем и подключаем роуты
app.use('/', productRouter);

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
