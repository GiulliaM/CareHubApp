import { Router } from 'express';
// Assumindo que o arquivo do controller de usuário está em '../controllers/usuarioController'
import { criarUsuario, loginUsuario } from '../controllers/usuarioController';

const router = Router();

// Rota pública para criar um novo usuário
// POST /api/autenticacao/registrar
router.post('/registrar', criarUsuario);

// Rota pública para fazer login
// POST /api/autenticacao/login
router.post('/login', loginUsuario);

export default router;