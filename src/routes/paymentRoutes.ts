import { Router } from 'express';
import paymentController from '../controllers/paymentController.js';

const router = Router();

const paymentControllers = new paymentController();

router.post('/customers', paymentControllers.createClient);
router.post('/payment', paymentControllers.createPaymentIntent);
router.post('/payment/confirm', paymentControllers.confirmPaymentIntent);

export default router;
