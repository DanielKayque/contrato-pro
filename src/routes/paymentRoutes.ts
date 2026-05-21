import { Router } from 'express';
import paymentController from '../controllers/paymentController.js';
import { Auth } from '../middlewares/auth.js';

const router = Router();

const paymentControllers = new paymentController();

const { autenticar } = new Auth();

router.use(autenticar);
//Todas as rotas aqui embaixo estão protegidas
router.post('/customers', paymentControllers.createClient);
router.post('/payment', paymentControllers.createPaymentIntent);
router.post('/payment/confirm', paymentControllers.confirmPaymentIntent);

export default router;
