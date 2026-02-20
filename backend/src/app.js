import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
import tarefaRoutes from "./routes/tarefaRoutes.js";
import medicamentoRoutes from "./routes/medicamentoRoutes.js";
import diarioRoutes from "./routes/diarioRoutes.js";
import cuidadorRoutes from "./routes/cuidadorRoutes.js";
import cuidadoresRoutes from "./routes/cuidadoresRoutes.js";
import vinculoRoutes from "./routes/vinculoRoutes.js";
import grupoCuidadoRoutes from "./routes/grupoCuidadoRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/tarefas", tarefaRoutes);
app.use("/api/medicamentos", medicamentoRoutes);
app.use("/api/diario", diarioRoutes);
app.use("/api/cuidador", cuidadorRoutes);
app.use("/api/cuidadores", cuidadoresRoutes);
app.use("/api/vinculos", vinculoRoutes);
app.use("/api/grupo", grupoCuidadoRoutes);

app.get("/", (req, res) => res.json({ message: "CareHub API OK", version: "2.0.0" }));

// Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({ message: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});

// Handler global de erros — captura qualquer exceção não tratada em qualquer rota
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`[ERRO NÃO TRATADO] ${req.method} ${req.originalUrl}:`, err.message);
  console.error(err.stack);
  res.status(500).json({
    message: "Erro interno do servidor.",
    detail: process.env.NODE_ENV !== "production" ? err.message : undefined,
  });
});

export default app;
