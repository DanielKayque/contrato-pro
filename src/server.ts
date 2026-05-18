import express from 'express';
import userRouter from '../src/routes/userRoutes.js';

const app = express();

app.use(express.json());

app.use(userRouter);

app.get('/', (req, res) => {
  return res.json({ message: 'funcionando' });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
