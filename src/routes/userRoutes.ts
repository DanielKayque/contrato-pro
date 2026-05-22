import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { AuthController } from '../controllers/authController.js';
import { ContratoController } from '../controllers/contratoController.js';
import { Auth } from '../middlewares/auth.js';

const router = Router();

const authController = new AuthController();
const { autenticar } = new Auth();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/authme', autenticar, authController.authMe);

export default router;
