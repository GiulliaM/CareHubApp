// back-end/src/routes/registroRoutes.ts
import { Router } from 'express';
import { criarRegistro } from '../controllers/registroController';
import { middlewareAutenticacao } from './autenticacao'; // Assumindo o caminho correto

const router = Router();

// Rota protegida para criar um novo registro
// POST /api/registros
router.post('/', middlewareAutenticacao, criarRegistro);

export default router;