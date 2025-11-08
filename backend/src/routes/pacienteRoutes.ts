// back-end/src/routes/pacienteRoutes.ts
import { Router } from 'express';
import { criarPaciente, getMeuPrimeiroPaciente, updatePaciente } from '../controllers/pacienteController';
import multer from 'multer';
import path from 'path';
// <<< MUDANÇA: Importar o "Segurança"
import { authMiddleware } from '../authMiddleware';

// --- Configuração do Multer (para upload de fotos) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
// --- Fim do Multer ---

const router = Router();

// --- ROTAS DE PACIENTE (TODAS PROTEGIDAS) ---

// POST /api/pacientes
// (Cria um novo paciente)
// O 'authMiddleware' roda primeiro, depois o 'upload', depois o 'criarPaciente'
router.post('/pacientes', authMiddleware, upload.single('foto'), criarPaciente);

// GET /api/meus-pacientes
// (Busca o primeiro paciente do usuário logado)
router.get('/meus-pacientes', authMiddleware, getMeuPrimeiroPaciente);

// PUT /api/pacientes/:id
// (Atualiza um paciente específico)
router.put('/pacientes/:id', authMiddleware, upload.single('foto'), updatePaciente);

export default router;