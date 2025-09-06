import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения из файла .env в корне проекта.
// Эта функция должна вызываться как можно раньше в коде.
dotenv.config();

// Определяем интерфейс для нашей конфигурации для обеспечения строгой типизации
interface IConfig {
  port: number;
  dbAddress: string;
  paths: {
    upload: string;
    temp: string;
  };
  cors: {
    origin: string;
  };
  auth: {
    refreshTokenExpiry: string;
    accessTokenExpiry: string;
  };
}

// --- Основной объект конфигурации ---
// Здесь мы извлекаем переменные, задаем значения по умолчанию и преобразуем типы.
const config: IConfig = {
  // Используем порт из .env или 3000 по умолчанию
  port: parseInt(process.env.PORT || '3000', 10),

  // Адрес базы данных (проверка на его наличие уже была выполнена выше)
  dbAddress: process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek',

  // Группируем пути для удобства и построения абсолютных путей
  paths: {
    // process.cwd() возвращает корневую директорию проекта
    upload: process.env.UPLOAD_PATH || path.join(process.cwd(), 'uploads'),
    temp:
      process.env.UPLOAD_PATH_TEMP ||
      path.join(process.cwd(), 'uploads', 'temp'),
  },

  // Настройки CORS
  cors: {
    // Адрес фронтенда для разрешения запросов, или '*' для всех в режиме разработки
    origin: process.env.ORIGIN_ALLOW || '*',
  },

  // Настройки токенов аутентификации
  auth: {
    refreshTokenExpiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d',
    accessTokenExpiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY || '1m',
  },
};

// Экспортируем типизированный и готовый к использованию объект конфигурации
export default config;
