// back-end/src/index.ts
import express from 'express';
import pacienteRoutes from './routes/pacienteRoutes';
import usuarioRoutes from './routes/usuarioRoutes'; // <-- Esta linha está correta
import path from 'path'; 

const app = express();
const port = 3000;

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'public/uploads')));

// --- ROTAS ---
app.use('/api', pacienteRoutes); // (ex: /api/pacientes)
app.use('/', usuarioRoutes);    // (ex: /usuarios, /login, /api/meu-perfil)

app.listen(port, () => {
    console.log(`Servidor Back-end MVC rodando em http://localhost:${port}`);
});