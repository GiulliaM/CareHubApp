import { Router } from 'express';
import { buscarDadosDashboard } from '../controllers/dashboardController';
import { middlewareAutenticacao } from './autenticacao';

const router = Router();

// Rota protegida para buscar os dados do dashboard
// O 'middlewareAutenticacao' protege a rota
// GET /api/dashboard/:pacienteId
router.get('/:pacienteId', middlewareAutenticacao, buscarDadosDashboard);

export default router;