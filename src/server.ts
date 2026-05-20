import express from 'express';
import userRouter from '../src/routes/userRoutes.js';
import contractRouter from '../src/routes/contractRoutes.js';

const app = express();

app.use(express.json());

app.use(userRouter);
app.use(contractRouter);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
