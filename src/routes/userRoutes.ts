import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { AuthController } from '../controllers/authController.js';

const router = Router();

const userController = new UserController();
const authController = new AuthController();

router.post('/', userController.criarUsuario);
router.post('/login', authController.login);

export default router;
