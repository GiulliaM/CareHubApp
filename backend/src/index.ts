// back-end/src/index.ts
import express from 'express';
import pacienteRoutes from './routes/pacienteRoutes';
import usuarioRoutes from './routes/usuarioRoutes';

const app = express();
const port = 3000;

app.use(express.json());

// <<< MUDANÇA: Torna a pasta 'public' visível
// Isso permite que o app acesse as fotos em http://SEU_IP:3000/public/uploads/imagem.jpg
app.use('/public', express.static('public'));


// --- ROTAS ---
app.use('/api', pacienteRoutes); // (ex: /api/pacientes)
app.use('/', usuarioRoutes);    // (ex: /usuarios, /login)

app.listen(port, () => {
    console.log(`Servidor Back-end MVC rodando em http://localhost:${port}`);
});