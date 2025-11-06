// back-end/src/routes/pacienteRoutes.ts
import { Router } from 'express';
import { criarPaciente } from '../controllers/pacienteController';
import multer from 'multer';

// Configura o multer. Por enquanto, não vamos salvar o upload,
// apenas ler os campos de texto.
const upload = multer();

const router = Router();

router.post('/pacientes', upload.none(), criarPaciente);

export default router;