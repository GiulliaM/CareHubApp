// back-end/src/models/Usuario.ts
import { pool } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// (Vamos precisar disso no Controller)
const JWT_SECRET = 'M1nh4Ch4v3S3cr3t4P4r4C4r3Hub!';

export type UsuarioPayload = {
  nome: string;
  email: string;
  senha: string;
  tipo_usuario: 'Familiar' | 'Cuidador';
};

export class Usuario {

  /**
   * (M) MODEL: Cria um novo usuário (criptografa a senha)
   */
  static async criar(dados: UsuarioPayload): Promise<any> {
    const { nome, email, senha, tipo_usuario } = dados;

    // 1. Criptografar a senha (A "Receita" do Chef)
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    // 2. Salvar no banco (A "Despensa")
    try {
      const [result] = await pool.query(
        'INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario) VALUES (?, ?, ?, ?)',
        [nome, email, senha_hash, tipo_usuario]
      );
      // @ts-ignore
      return { id: result.insertId, nome, email, tipo_usuario };
    } catch (error: any) {
      // Erro comum: Email duplicado
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Este e-mail já está em uso.');
      }
      throw error;
    }
  }

  /**
   * (M) MODEL: Autentica um usuário e retorna um token
   */
  static async login(email: string, senha: string): Promise<any> {
    // 1. Buscar o usuário pelo email
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );

    // @ts-ignore
    if (rows.length === 0) {
      throw new Error('Credenciais inválidas.');
    }

    // @ts-ignore
    const usuario = rows[0];

    // 2. Comparar a senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      throw new Error('Credenciais inválidas.');
    }

    // 3. Gerar o "crachá" (Token JWT)
    const tokenPayload = { 
      id: usuario.id, 
      email: usuario.email, 
      tipo: usuario.tipo_usuario 
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    // 4. Retornar os dados
    return {
      token: token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo_usuario
      }
    };
  }
}