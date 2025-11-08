// back-end/src/index.ts
import express from 'express';
import pacienteRoutes from './routes/pacienteRoutes';
<<<<<<< HEAD
import usuarioRoutes from './routes/usuarioRoutes';
import tarefasRoutes from './routes/tarefas'; // <-- IMPORTADO
=======
import usuarioRoutes from './routes/usuarioRoutes'; // <-- Esta linha está correta
>>>>>>> 8edde29b2d5c2583de653d4a761aad5d27e2084f
import path from 'path'; 

const app = express();
const port = 3000;

app.use(express.json());

<<<<<<< HEAD
// Torna a pasta 'public' visível
=======
>>>>>>> 8edde29b2d5c2583de653d4a761aad5d27e2084f
app.use('/uploads', express.static(path.join(__dirname, '..', 'public/uploads')));

// --- ROTAS ---
<<<<<<< HEAD
// Certifique-se de que os paths aqui correspondem à sua estrutura
app.use('/', usuarioRoutes);    // (ex: /usuarios, /login)
app.use('/api', pacienteRoutes); // (ex: /api/pacientes)
app.use('/api', tarefasRoutes);  // <-- ADICIONADO: Rotas de Tarefas (Ex: /api/tarefas, /api/paciente/:id/tarefas/date/:date)
=======
app.use('/api', pacienteRoutes); // (ex: /api/pacientes)
app.use('/', usuarioRoutes);    // (ex: /usuarios, /login, /api/meu-perfil)
>>>>>>> 8edde29b2d5c2583de653d4a761aad5d27e2084f

app.listen(port, () => {
    console.log(`Servidor Back-end MVC rodando em http://localhost:${port}`);
});