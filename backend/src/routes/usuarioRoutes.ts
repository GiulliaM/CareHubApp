// back-end/src/routes/usuarioRoutes.ts
import { Router } from 'express';
import { criarUsuario, loginUsuario } from '../controllers/usuarioController';

const router = Router();

// As rotas que o front-end chama!
router.post('/usuarios', criarUsuario);
router.post('/login', loginUsuario);

export default router;