import BaseError from './base-error';

class BadRequestError extends BaseError {
  constructor(message = 'Переданы некорректные данные') {
    super(400, message);
  }
}

export default BadRequestError;
