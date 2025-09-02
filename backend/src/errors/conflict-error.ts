import BaseError from './base-error';

class ConflictError extends BaseError {
  constructor(message = 'Конфликт данных') {
    super(409, message);
  }
}

export default ConflictError;
