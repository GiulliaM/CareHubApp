export interface IPacientePerfil {
  id: number;
  nome_paciente: string;
  data_nascimento?: string | null;
  informacoes_medicas?: string | null;
  foto_url?: string | null;
  nome_cuidador_ativo?: string | null;
}

export interface ICuidadoResumo {
  nome: string;
  horario: string;
}

export interface IRegistroResumo {
  tipo?: string;
  titulo: string;
  subtitulo?: string;
  data?: string;
}

export interface IDadosDashboard {
  perfilPaciente: IPacientePerfil | null;
  proximoMedicamento: ICuidadoResumo | null;
  proximaConsulta: ICuidadoResumo | null;
  cuidadorAtivo: { nome?: string | null };
  alertasPendentes: { total: number };
  atividadesRecentes: IRegistroResumo[];
}

export const initialDashboardData: IDadosDashboard = {
  perfilPaciente: null,
  proximoMedicamento: null,
  proximaConsulta: null,
  cuidadorAtivo: { nome: null },
  alertasPendentes: { total: 0 },
  atividadesRecentes: [],
};