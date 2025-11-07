// back-end/src/routes/usuarioRoutes.ts
import { Router } from 'express';
// Importa TODAS as funções do controller
import { criarUsuario, loginUsuario, getMeuPerfil, updateMeuPerfil } from '../controllers/usuarioController';
// Importa o "Segurança"
import { authMiddleware } from '../authMiddleware';

const router = Router();

// --- Rotas Públicas (Sem segurança) ---
router.post('/usuarios', criarUsuario);
router.post('/login', loginUsuario);

// --- Rotas Protegidas (Precisa de Token) ---
// O 'authMiddleware' é o "Segurança" que roda antes
router.get('/api/meu-perfil', authMiddleware, getMeuPerfil);
router.put('/api/meu-perfil', authMiddleware, updateMeuPerfil);

export default router;