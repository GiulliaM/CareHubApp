// back-end/src/routes/pacienteRoutes.ts
import { Router } from 'express';
import { criarPaciente } from '../controllers/pacienteController';
import multer from 'multer';
import path from 'path';

// --- MUDANÇA: Configuração completa do Multer ---
const storage = multer.diskStorage({
  // Onde salvar o arquivo
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  // Como nomear o arquivo (para evitar nomes iguais)
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
// --- FIM DA MUDANÇA ---

const router = Router();

// <<< MUDANÇA:
// A rota agora usa o 'upload' configurado
router.post('/pacientes', upload.single('foto'), criarPaciente);

export default router;