// back-end/src/index.ts
import express from 'express';
// Importa as rotas de pacientes
import pacienteRoutes from './routes/pacienteRoutes';
// (No futuro, importaremos as rotas de usuário aqui também)

const app = express();
const port = 3000;

// Habilita a API para receber JSON
app.use(express.json());

// Diz ao Express para usar as rotas de paciente
// Todos os pedidos para /api/pacientes irão para 'pacienteRoutes'
app.use('/api', pacienteRoutes);

// (Aqui também colocaremos as rotas de usuário/login)

app.listen(port, () => {
    console.log(`Servidor Back-end MVC rodando em http://localhost:${port}`);
});