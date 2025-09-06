import BaseError from './base-error';

class NotFoundError extends BaseError {
  constructor(message = 'Запрашиваемый ресурс не найден') {
    super(404, message);
  }
}

export default NotFoundError;
