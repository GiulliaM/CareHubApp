import { Router } from 'express';
import { criarPaciente } from '../controllers/pacienteController';
import { middlewareAutenticacao } from './autenticacao';

const router = Router();

// Rota protegida para criar um novo paciente
// O 'middlewareAutenticacao' garante que só usuários logados podem fazer isso
// POST /api/pacientes
router.post('/', middlewareAutenticacao, criarPaciente);

// (Você pode adicionar outras rotas aqui, ex: router.get('/', middlewareAutenticacao, ...))

export default router;