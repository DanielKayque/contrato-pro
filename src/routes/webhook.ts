import { Router } from 'express';
import PaymentController from '../controllers/paymentController.js';
import express from 'express';

const router = Router();

const { handleWebhook } = new PaymentController();

//Essa é uma rota que necessariamente precisa receber um raw buffer para nn misturar os dados ao converter para json.

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook,
);

export default router;
