/**
 * server.js — ponto de entrada do CareHub Backend (ES Module)
 *
 * IMPORTANTE: Em ES Modules, "import" estático é içado (hoisted) antes
 * de qualquer código, então o dotenv precisa ser carregado via import()
 * dinâmico ANTES de importar app.js. Isso garante que process.env esteja
 * populado quando db.js e os controllers inicializarem.
 */

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ES Modules não têm __dirname nativo — reconstruímos a partir de import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

console.log("--- INICIANDO SERVIDOR ---");

// Estratégia: tenta carregar .env da raiz do backend (padrão profissional)
// Se não encontrar, tenta em src/ (padrão alternativo da VPS)
const envPathRoot = path.resolve(__dirname, "../.env");
const envPathSrc  = path.resolve(__dirname, ".env");

const resultRoot = dotenv.config({ path: envPathRoot });

if (resultRoot.error) {
  console.log("⚠️  .env não encontrado na raiz, tentando em src/...");
  const resultSrc = dotenv.config({ path: envPathSrc });
  if (resultSrc.error) {
    console.warn("⚠️  .env também não encontrado em src/. Usando variáveis de ambiente do sistema.");
  }
}

console.log("--- DIAGNÓSTICO DE AMBIENTE ---");
console.log("Diretório base (__dirname):", __dirname);
console.log("JWT_SECRET Carregado      :", process.env.JWT_SECRET ? "SIM ✅" : "NÃO ❌ — verifique o .env!");
console.log("DB_USER                   :", process.env.DB_USER   || "não definido ❌");
console.log("DB_HOST                   :", process.env.DB_HOST   || "não definido ❌");
console.log("-------------------------------");

// Import dinâmico garante que app.js só é carregado DEPOIS do dotenv.config()
// Isso evita que db.js e controllers inicializem com process.env vazio.
const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor CareHub rodando na porta ${PORT}`);
});
