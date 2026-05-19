import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { AuthController } from '../controllers/authController.js';
import { ContratoController } from '../controllers/contratoController.js';
import { Auth } from '../middlewares/auth.js';

const router = Router();

const userController = new UserController();
const authController = new AuthController();
const contratoController = new ContratoController();
const { autenticar } = new Auth();

router.post('/', userController.criarUsuario);
router.post('/login', authController.login);

// Rotas de contratos — todas protegidas
router.post('/contratos/gerar', autenticar, contratoController.gerar);
router.get('/contratos', autenticar, contratoController.listar);

export default router;
