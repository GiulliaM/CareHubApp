import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'M1nh4Ch4v3S3cr3t4P4r4C4r3Hub!';

/*
  Interface do payload esperado dentro do token JWT.
*/
interface TokenPayload {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: 'Familiar' | 'Cuidador';
  iat: number; // issued at (timestamp)
  exp: number; // expiration (timestamp)
}

/*
  Augmentação simples do tipo Request do Express para incluir `usuario` após
  a validação do token. 
*/
declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload;
    }
  }
}

/**
 * middlewareAutenticacao
 *
 * - Lê o header `Authorization` (espera "Bearer <token>").
 * - Valida o token JWT usando a chave `JWT_SECRET`.
 * - Ao validar, anexa o payload decodificado em `req.usuario`.
 * - Em caso de falha, responde com 401 e não chama `next()`.
 *
 * Uso: app.use('/rota-protegida', middlewareAutenticacao, rotaProtegidaHandler)
 */
export const middlewareAutenticacao = (req: Request, res: Response, next: NextFunction) => {
  // 1) Pegar o header de autorização
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // Não foi enviado header Authorization
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  // 2) Espera o formato "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    // Formato inválido
    return res.status(401).json({ message: 'Formato de token inválido.' });
  }

  const token = parts[1];

  // 3) Verifica se o token é válido e decodifica o payload
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // 4) Anexa o payload ao request para os controllers subsequentes usarem
    req.usuario = payload;

    // 5) Prossegue para o próximo middleware/controller
    return next();
  } catch (error) {
    // Token inválido, expirado ou falha na verificação
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};