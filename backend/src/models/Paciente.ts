// back-end/src/models/Paciente.ts
import { pool } from '../db';
// @ts-ignore
import { IPacientePerfil } from '../tipos/IDadosDashboard'; // Assumindo que você usa essa interface do frontend

// Perfil simplificado do paciente
export interface IPacientePerfil {
  id: number;
  nome_paciente: string;
  data_nascimento?: string | null;
  informacoes_medicas?: string | null;
  foto_url?: string | null;
  // Propriedade que é buscada através do relacionamento
  nome_cuidador_ativo?: string | null; 
}

export class Paciente {

  /**
   * (M) MODEL: Busca o perfil do paciente e o nome do cuidador ativo.
   */
  static async buscarPerfilPorId(pacienteId: number): Promise<IPacientePerfil | null> {
    try {
      const [rows] = await pool.query(
        // Consulta complexa para unir Paciente e seu Cuidador Principal/Ativo
        `SELECT
          p.id,
          p.nome AS nome_paciente,
          p.data_nascimento,
          p.informacoes_medicas,
          p.foto_url,
          u.nome AS nome_cuidador_ativo
        FROM
          pacientes p
        LEFT JOIN
          paciente_usuarios pu ON pu.fk_paciente_id = p.id AND pu.relacao = 'Principal'
        LEFT JOIN
          usuarios u ON u.id = pu.fk_usuario_id
        WHERE
          p.id = ?;
        `,
        [pacienteId]
      );
      
      // @ts-ignore
      return rows.length ? rows[0] : null;

    } catch (error) {
      console.error("Erro ao buscar perfil do paciente:", error);
      return null;
    }
  }

  /**
   * (M) MODEL: Verifica se o usuário tem permissão para acessar o paciente.
   */
  static async usuarioTemAcesso(usuarioId: number, pacienteId: number): Promise<boolean> {
    try {
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS total
         FROM paciente_usuarios
         WHERE fk_usuario_id = ? AND fk_paciente_id = ?;`,
        [usuarioId, pacienteId]
      );
      
      // @ts-ignore
      return rows[0].total > 0;
    } catch (error) {
      console.error("Erro ao verificar acesso do usuário:", error);
      return false;
    }
  }
}