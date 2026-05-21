import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { AuthController } from '../controllers/authController.js';
import { ContratoController } from '../controllers/contratoController.js';
import { Auth } from '../middlewares/auth.js';

const router = Router();

const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
