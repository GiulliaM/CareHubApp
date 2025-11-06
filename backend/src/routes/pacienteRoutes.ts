// back-end/src/routes/pacienteRoutes.ts
import { Router } from 'express';
import { criarPaciente } from '../controllers/pacienteController';
import multer from 'multer';

// <<< MUDANÇA AQUI
// Configura o multer para esperar UM arquivo, com o nome de campo "foto".
// Ele também vai ler todos os outros campos de texto (nome, etc.).
const upload = multer(); // (Por enquanto, salva na memória)

const router = Router();

// <<< MUDANÇA AQUI
// Use 'upload.single('foto')' em vez de 'upload.none()'
router.post('/pacientes', upload.single('foto'), criarPaciente);

export default router;