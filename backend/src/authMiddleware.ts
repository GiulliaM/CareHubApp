// back-end/src/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'M1nh4Ch4v3S3cr3t4P4r4C4r3Hub!'; // (A mesma chave do Usuario.ts)

// Esta é uma interface para "ensinar" o TypeScript
// que o 'req' pode ter uma propriedade 'usuario'
export interface AuthRequest extends Request {
  usuario?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. O usuário enviou o "crachá" (Token)?
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  // 2. O "crachá" é válido?
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload; // <<< MÁGICA: Anexa os dados do usuário (id, email) no 'req'
    next(); // Deixa a requisição passar para o próximo passo (o Controller)
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};