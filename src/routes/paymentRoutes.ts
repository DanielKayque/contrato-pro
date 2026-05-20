import { Router } from 'express';
import { ContratoController } from '../controllers/contratoController.js';
import paymentControl from '../controllers/paymentController.js';
import paymentController from '../controllers/paymentController.js';

const router = Router();

const paymentControllers = new paymentController();

router.post('/customers', paymentControllers.createClient);

export default router;
