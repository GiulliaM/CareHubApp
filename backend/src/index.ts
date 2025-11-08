// back-end/src/index.ts
import express from 'express';
import pacienteRoutes from './routes/pacienteRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import tarefasRoutes from './routes/tarefas'; // <-- IMPORTADO
import path from 'path'; 

const app = express();
const port = 3000;

app.use(express.json());

// Torna a pasta 'public' visível
app.use('/uploads', express.static(path.join(__dirname, '..', 'public/uploads')));

// --- ROTAS ---
// Certifique-se de que os paths aqui correspondem à sua estrutura
app.use('/', usuarioRoutes);    // (ex: /usuarios, /login)
app.use('/api', pacienteRoutes); // (ex: /api/pacientes)
app.use('/api', tarefasRoutes);  // <-- ADICIONADO: Rotas de Tarefas (Ex: /api/tarefas, /api/paciente/:id/tarefas/date/:date)

app.listen(port, () => {
    console.log(`Servidor Back-end MVC rodando em http://localhost:${port}`);
});