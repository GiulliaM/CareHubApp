import { Request, Response } from 'express';
// @ts-ignore
import { Paciente, IPacientePerfil } from '../models/Paciente';
import { Tarefa } from '../models/Tarefa';
import { Registro } from '../models/Registro';

// Importe date-fns para formatar datas e horas
import { format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interface para os dados do dashboard que serão enviados ao frontend
interface IDadosDashboard {
  proximoMedicamento: { nome: string; horario: string; } | null;
  proximaConsulta: { nome: string; horario: string; } | null;
  cuidadorAtivo: { nome: string | null };
  alertasPendentes: { total: number };
  perfilPaciente: IPacientePerfil | null;
  atividadesRecentes: any[]; // (Placeholder para o futuro)
}

// Função helper para formatar datas de consulta
function formatarDataConsulta(dataSql: string, horaSql: string | null): string {
  try {
    // Normaliza hora para HH:mm:ss quando fornecida como HH:mm
    const horaNormalizada = horaSql
      ? (horaSql.length === 5 ? `${horaSql}:00` : horaSql)
      : '00:00:00';

    // Monta um ISO compatível (YYYY-MM-DDTHH:mm:ss)
    const iso = `${dataSql}T${horaNormalizada}`;

    const data = new Date(iso);

    if (isToday(data)) {
      return `Hoje${horaSql ? `, às ${format(data, 'HH:mm')}` : ''}`;
    }
    if (isTomorrow(data)) {
      return `Amanhã${horaSql ? `, às ${format(data, 'HH:mm')}` : ''}`;
    }
    // Formato '08/11 às 10:30'
    return format(data, "dd/MM 'às' HH:mm", { locale: ptBR });
  } catch (e) {
    console.error("Erro ao formatar data:", e);
    return dataSql; // Retorna o valor bruto em caso de erro
  }
}

/**
 * (C) CONTROLLER: Busca todos os dados para o dashboard (Home)
 */
export const buscarDadosDashboard = async (req: Request, res: Response) => {
  try {
    // 1. Pegar o ID do paciente (da URL, ex: /api/dashboard/1)
    const { pacienteId } = req.params;
    const idNum = parseInt(String(pacienteId), 10);

    if (isNaN(idNum)) {
      return res.status(400).json({ message: "ID do paciente inválido." });
    }

    // 2. (SEGURANÇA) Verificar se o usuário logado tem acesso a este paciente
    // (req.usuario.id) viria do seu token JWT (do middlewareAutenticacao)
    const usuarioId = (req as any).usuario?.id;
    if (!usuarioId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const temAcesso = await Paciente.usuarioTemAcesso(usuarioId, idNum);
    if (!temAcesso) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    // 3. Buscar todos os dados em paralelo (muito mais rápido!)
    const [
      perfilPaciente,
      proximoMedicamento,
      proximaConsulta,
      alertasPendentes
      // Você pode adicionar a busca por atividades recentes aqui
    ] = await Promise.all([
      Paciente.buscarPerfilPorId(idNum),
      Tarefa.buscarProximoMedicamento(idNum),
      Tarefa.buscarProximaConsulta(idNum),
      Registro.contarAlertasPendentes(idNum)
    ]);

    if (!perfilPaciente) {
      return res.status(404).json({ message: "Paciente não encontrado." });
    }

    // 4. Montar a resposta para o frontend
    const dadosDashboard: IDadosDashboard = {
      perfilPaciente: perfilPaciente,

      proximoMedicamento: proximoMedicamento ? {
        nome: proximoMedicamento.titulo,
        // Garantir formato "HH:mm" a partir de possíveis "HH:mm:ss" ou "HH:mm"
        horario: proximoMedicamento.horario_tarefa
          ? proximoMedicamento.horario_tarefa.split(':').slice(0, 2).join(':')
          : ''
      } : null,

      proximaConsulta: proximaConsulta ? {
        nome: proximaConsulta.titulo,
        horario: formatarDataConsulta(
          // repete_ate deve ser YYYY-MM-DD; validação defensiva:
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

      atividadesRecentes: [] // (Vazio por enquanto)
    };

    // 5. Enviar a resposta
    res.status(200).json(dadosDashboard);

  } catch (error: any) {
    console.error("Erro no controller ao buscar dados do dashboard:", error);
    res.status(500).json({ message: 'Erro ao buscar dados do dashboard', error: error?.message || String(error) });
  }
};