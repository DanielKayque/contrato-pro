import { Router } from 'express';
import { ContratoController } from '../controllers/contratoController.js';
import { Auth } from '../middlewares/auth.js';

const router = Router();

const contratoController = new ContratoController();

const { autenticar } = new Auth();

// Rotas de contratos — todas protegidas
router.post('/contratos/gerar', autenticar, contratoController.gerar);
router.get('/contratos', autenticar, contratoController.listar);
router.get('/contratos/:id', autenticar, contratoController.listarUm);

export default router;
