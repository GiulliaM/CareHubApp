// back-end/src/controllers/dashboardController.ts (Versão Corrigida)

import { Request, Response } from 'express';
// 💡 Mantenha @ts-ignore se o TypeScript não reconhecer o caminho ou tipo.
// @ts-ignore
import { Paciente, IPacientePerfil } from '../models/Paciente'; 
// @ts-ignore
import { Medicamento } from '../models/Medicamento';
import { Tarefa } from '../models/Tarefa';
import { Registro } from '../models/Registro';
import { AuthRequest } from '../authMiddleware'; 

// Importe date-fns para formatar datas e horas
import { format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interface para os dados do dashboard (Deve espelhar a do frontend)
interface IDadosDashboard {
  proximoMedicamento: { nome: string; horario: string; } | null;
  proximaConsulta: { nome: string; horario: string; } | null;
  cuidadorAtivo: { nome: string | null };
  alertasPendentes: { total: number };
  perfilPaciente: IPacientePerfil | null;
  atividadesRecentes: any[]; // Usaremos IRegistroResumo no frontend
}

// Função helper para formatar datas de consulta (mantida)
function formatarDataConsulta(dataSql: string, horaSql: string | null): string {
  try {
    const horaNormalizada = horaSql
      ? (horaSql.length === 5 ? `${horaSql}:00` : horaSql)
      : '00:00:00';

    const iso = `${dataSql}T${horaNormalizada}`;
    const data = new Date(iso);

    if (isToday(data)) {
      return `Hoje, às ${format(data, 'HH:mm', { locale: ptBR })}`;
    }
    if (isTomorrow(data)) {
      return `Amanhã, às ${format(data, 'HH:mm', { locale: ptBR })}`;
    }
    return format(data, 'dd/MM/yyyy HH:mm', { locale: ptBR });

  } catch (e) {
    return 'Data indefinida';
  }
}

export const buscarDadosDashboard = async (req: AuthRequest, res: Response) => {
  const { pacienteId } = req.params;
  const idNum = parseInt(pacienteId, 10);
  const usuarioId = req.usuario.id;

  if (isNaN(idNum)) {
    return res.status(400).json({ message: "ID do paciente inválido." });
  }

  try {
    // 1. (SEGURANÇA) Verificar se o usuário tem acesso
    const temAcesso = await Paciente.usuarioTemAcesso(usuarioId, idNum);
    if (!temAcesso) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    // 2. Coletar dados de várias fontes em paralelo
    const [
      perfilPaciente,
      proximoMedicamento,
      proximaConsulta,
      alertasPendentes,
      atividadesRecentesRaw 
    ] = await Promise.all([
      // 💡 CORREÇÃO APLICADA AQUI: mudado de buscarPerfilDashboard para buscarPerfilPorId
      Paciente.buscarPerfilPorId(idNum), 
      
      // Assumindo que os métodos de Medicamento/Tarefa/Registro estão corretos
      Medicamento.buscarProximoMedicamento(idNum),
      Tarefa.buscarProximaConsulta(idNum),
      Registro.contarAlertasPendentes(idNum),
      // @ts-ignore
      Registro.buscarAtividadesRecentes(idNum, 5) 
    ]);

    if (!perfilPaciente) {
      return res.status(404).json({ message: "Paciente não encontrado." });
    }

    // 3. Montar a resposta para o frontend
    const dadosDashboard: IDadosDashboard = {
      perfilPaciente: perfilPaciente,

      proximoMedicamento: proximoMedicamento ? {
        // Assumindo que 'titulo' e 'horario_tarefa' são as propriedades corretas
        nome: proximoMedicamento.titulo, 
        horario: proximoMedicamento.horario_tarefa
          ? proximoMedicamento.horario_tarefa.split(':').slice(0, 2).join(':')
          : ''
      } : null,

      proximaConsulta: proximaConsulta ? {
        // Assumindo que 'titulo', 'repete_ate' e 'horario_tarefa' são as propriedades corretas
        nome: proximaConsulta.titulo,
        horario: formatarDataConsulta(
          String(proximaConsulta.repete_ate || ''),
          proximaConsulta.horario_tarefa || null
        )
      } : null,

      cuidadorAtivo: {
        nome: perfilPaciente.nome_cuidador_ativo || "Não definido"
      },

      alertasPendentes: {
        total: Number(alertasPendentes) || 0
      },

      atividadesRecentes: atividadesRecentesRaw.map((reg: any) => ({
        // Mapeamento dos campos do Registro para o formato IRegistroResumo
        tipo: reg.tipo_registro,
        titulo: reg.tipo_registro, 
        subtitulo: reg.comentario,
        data: format(new Date(reg.data_registro), 'dd/MM HH:mm', { locale: ptBR }),
      }))
    };

    // 4. Enviar a resposta
    res.status(200).json(dadosDashboard);

  } catch (error: any) {
    console.error("Erro ao buscar dados do dashboard:", error);
    res.status(500).json({ message: 'Erro interno ao buscar dados do dashboard.', error: error.message });
  }
};