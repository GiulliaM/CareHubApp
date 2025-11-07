// back-end/src/index.ts
import express from 'express';
import pacienteRoutes from './routes/pacienteRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import path from 'path'; // Importe o 'path'

const app = express();
const port = 3000;

app.use(express.json());

// <<< MUDANÇA: Torna a pasta 'public' visível
// Isso permite que o app acesse as fotos em http://SEU_IP:3000/uploads/imagem.jpg
app.use('/uploads', express.static(path.join(__dirname, '..', 'public/uploads')));


// --- ROTAS ---
app.use('/api', pacienteRoutes); // (ex: /api/pacientes)
app.use('/', usuarioRoutes);    // (ex: /usuarios, /login)

app.listen(port, () => {
    console.log(`Servidor Back-end MVC rodando em http://localhost:${port}`);
});