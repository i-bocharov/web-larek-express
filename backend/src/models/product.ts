import mongoose from 'mongoose';

interface IProduct {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description?: string;
  price?: number | null;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      minlength: [2, 'Минимальная длина поля "title" - 2 символа'],
      maxlength: [30, 'Максимальная длина поля "title" - 30 символов'],
      required: [true, 'Поле "title" должно быть заполнено'],
      unique: true,
    },
    image: {
      type: {
        fileName: {
          type: String,
          required: [true, 'Поле "fileName" должно быть заполнено'],
        },
        originalName: {
          type: String,
          required: [true, 'Поле "originalName" должно быть заполнено'],
        },
      },
      _id: false,
      required: [
        true,
        'Поле "image" со всеми его полями должно быть заполнено',
      ],
    },
    category: {
      type: String,
      required: [true, 'Поле "category" должно быть заполнено'],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: null,
      min: [0, 'Цена не может быть отрицательной'],
    },
  },
  { versionKey: false },
);

export default mongoose.model<IProduct>('product', productSchema);
