// back-end/src/routes/pacienteRoutes.ts
import { Router } from 'express';
import { criarPaciente } from '../controllers/PacienteControler';

const router = Router();

// A rota que o front-end está chamando: /api/pacientes
router.post('/pacientes', criarPaciente);

export default router;