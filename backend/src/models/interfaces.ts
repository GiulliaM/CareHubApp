export interface IPacientePerfil {
  id: number;
  nome_paciente: string;
  data_nascimento?: string | null;
  informacoes_medicas?: string | null;
  foto_url?: string | null;
  nome_cuidador_ativo?: string | null; 
}
export interface ITarefa {
  id?: number;
  fk_paciente_id: number;
  fk_responsavel_id?: number | null; 
  titulo: string;
  status: 'Pendente' | 'Concluída' | 'Atrasada'; 
  tipo_recorrencia: 'Única' | 'Diária' | 'Semanal' | 'Mensal'; 
  horario_tarefa: string | null; 
  repete_ate: string | null; 
  data_criacao?: string;
}
export interface ITarefaCreate {
  fk_paciente_id: number;
  fk_responsavel_id?: number | null; 
  titulo: string;
  horario_tarefa?: string | null;
  repete_ate: string; 
  tipo_recorrencia?: 'Única' | 'Diária' | 'Semanal' | 'Mensal';
}
