import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';

// Определяем абсолютный путь к папке logs в корне проекта.
const logsDirectory = path.join(process.cwd(), 'logs');

/**
 * Middleware для логирования всех входящих запросов.
 * Записывает информацию о каждом запросе в файл request.log.
 */
export const requestLogger = expressWinston.logger({
  // Указываем, что логи нужно писать в файл.
  transports: [
    new winston.transports.File({
      filename: path.join(logsDirectory, 'request.log'),
    }),
  ],
  // Форматируем каждую запись как отдельный JSON-объект.
  format: winston.format.json(),
  // Включаем в лог полную мета-информацию о запросе (headers, body и т.д.).
  meta: true,
  // Шаблон для основного сообщения.
  msg: '{{req.method}} {{req.url}} {{res.statusCode}} - {{res.responseTime}}ms',
});

/**
 * Middleware для логирования ошибок.
 * Срабатывает только если запрос завершился ошибкой.
 * Записывает информацию об ошибке в файл error.log.
 */
export const errorLogger = expressWinston.errorLogger({
  // Указываем, что логи ошибок нужно писать в файл.
  transports: [
    new winston.transports.File({
      filename: path.join(logsDirectory, 'error.log'),
    }),
  ],
  // Также используем JSON-формат для удобства анализа.
  format: winston.format.json(),
});

/**
 * Глобальный логгер для общих событий приложения (старт сервера, подключение к БД и т.д.).
 * В режиме разработки пишет в консоль в удобном, цветном формате.
 * В продакшене можно будет легко добавить запись в файл.
 */
export const logger = winston.createLogger({
  // Уровень логирования. 'info' означает, что будут записываться все логи уровня info и выше (warn, error).
  level: 'info',
  // Формат логов.
  format: winston.format.combine(
    winston.format.colorize(), // Раскрашивает вывод в консоли
    winston.format.simple(), // Простой текстовый формат: level: message
  ),
  // Указываем, куда писать. В данном случае, только в консоль.
  transports: [new winston.transports.Console()],
});
