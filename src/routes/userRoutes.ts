import { Router } from 'express';
import { userService } from '../controllers/userController.js';

const router = Router();

const userController = new userService();

router.post('/', userController.criarUsuario);

export default router;
