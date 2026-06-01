import express from 'express';
import userRouter from '../src/routes/userRoutes.js';
import contractRouter from '../src/routes/contractRoutes.js';
import paymentRouter from '../src/routes/paymentRoutes.js';
import webhookRouter from '../src/routes/webhook.js';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(webhookRouter);

app.use(express.json());

app.use(userRouter);
app.use(contractRouter);
app.use(paymentRouter);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
