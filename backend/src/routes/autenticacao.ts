import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = 'M1nh4Ch4v3S3cr3t4P4r4C4r3Hub!';

interface TokenPayload {

    id: number;
    nome: string;
    email: string;
    tipo_usuario: 'Familiar' | 'Cuidador';
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            usuario?: TokenPayload;
        }
    }
}

/**
 * (Middleware) Verifica o token JWT enviado no header 'Authorization'
 * e anexa os dados do usuário ao 'req.usuario'.
 */

export const middlewareAutenticacao = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    const parts  = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Formato de token inválido.' });
    }

    const token = parts[1];

      // 3. Verifica se o token é válido
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // 4. Anexa o payload ao request para ser usado nos controllers
    req.usuario = payload;

    return next(); // Tudo certo, pode continuar para o controller
  
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};