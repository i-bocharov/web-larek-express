import express from 'express';
import mongoose from 'mongoose';

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/weblarek');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
