import { celebrate, Joi, Segments } from 'celebrate';
import mongoose from 'mongoose';

const createOrderValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().required().valid('card', 'online'),
    email: Joi.string().required().email(),
    phone: Joi.string()
      .required()
      .pattern(/^\+\d{10,15}$/),
    address: Joi.string().required().min(1),
    total: Joi.number().required().positive(),
    items: Joi.array()
      .items(
        Joi.string().custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid', {
              message: `Некорректный ID товара: ${value}`,
            });
          }
          return value;
        }),
      )
      .min(1)
      .required(),
  }),
});

export default createOrderValidator;
