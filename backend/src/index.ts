// back-end/src/index.ts
import express from 'express';
import pacienteRoutes from './routes/pacienteRoutes';
import usuarioRoutes from './routes/usuarioRoutes'; // <<< ADICIONE ESTA LINHA

const app = express();
const port = 3000;

app.use(express.json());

// --- ROTAS ---
app.use('/api', pacienteRoutes); // (ex: /api/pacientes)
app.use('/', usuarioRoutes);    // <<< ADICIONE ESTA LINHA (ex: /usuarios, /login)

app.listen(port, () => {
    console.log(`Servidor Back-end MVC rodando em http://localhost:${port}`);
});