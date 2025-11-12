# 📋 Sistema de Agendamento Inteligente de Medicamentos

## 🎯 Visão Geral

Este sistema permite que os usuários criem agendamentos de medicamentos de forma inteligente, usando intervalos regulares (4/4h, 6/6h, 8/8h, 12/12h) ou definindo horários manualmente.

## ✅ O que foi implementado

### 1. **Migrations do Banco de Dados** ✅

Foram criados dois arquivos de migration:

#### `001_update_medicamentos_schema.sql` (MariaDB 10.6+)
- Adiciona campo `tipo_agendamento` (manual/intervalo)
- Adiciona campo `intervalo_horas` (4, 6, 8, 12)
- Adiciona campo `data_fim` (data de término ou NULL para uso contínuo)
- Adiciona campo `dias_semana` (quais dias da semana repetir)
- Modifica `horarios` para suportar JSON

#### `001_update_medicamentos_schema_legacy.sql` (MySQL < 5.7)
- Mesmos campos, mas mantém `horarios` como TEXT

**Status:** ✅ Executado com sucesso no banco de dados

### 2. **Utilitários Frontend** ✅

Arquivo: `frontend/src/utils/medicamentoSchedule.ts`

Funções disponíveis:
- `generateScheduleTimes(startTime, intervalHours)` - Gera horários automáticos
- `isActiveMedication(medicamento, data)` - Verifica se medicamento está ativo
- `getActiveMedicationsForDate(medicamentos, data)` - Filtra medicamentos ativos
- `shouldShowOnWeekday(medicamento, diaSemana)` - Verifica se deve aparecer no dia
- `getMedicamentoHorarios(medicamento)` - Obtém array de horários
- `formatHorariosForDB(horarios)` - Formata para salvar no banco

Constantes:
- `INTERVAL_OPTIONS` - Opções de intervalo (4/4h, 6/6h, 8/8h, 12/12h)
- `DIAS_SEMANA` - Dias da semana para seleção

### 3. **Componentes React Native** ✅

#### `IntervalModal.tsx`
Modal para selecionar intervalo de medicação:
- Mostra opções: 4/4h, 6/6h, 8/8h, 12/12h
- Exibe quantas doses por dia
- Retorna o intervalo selecionado

#### `HorariosList.tsx` (já existia)
Lista de horários com funcionalidades:
- Exibir horários programados
- Editar horários individuais
- Remover horários
- Adicionar novos horários manualmente

## 🚀 Como Usar na Tela "Novo Medicamento"

### Passo 1: Importar os componentes e utils

```tsx
import IntervalModal from '../components/IntervalModal';
import HorariosList from '../components/HorariosList';
import { 
  generateScheduleTimes, 
  formatHorariosForDB 
} from '../utils/medicamentoSchedule';
```

### Passo 2: Adicionar estados

```tsx
const [tipoAgendamento, setTipoAgendamento] = useState<'manual' | 'intervalo'>('manual');
const [intervaloHoras, setIntervaloHoras] = useState<number | null>(null);
const [horarios, setHorarios] = useState<string[]>([]);
const [horarioInicio, setHorarioInicio] = useState('08:00');
const [showIntervalModal, setShowIntervalModal] = useState(false);
const [dataFim, setDataFim] = useState<Date | null>(null);
const [usoContinuo, setUsoContinuo] = useState(true);
const [diasSemana, setDiasSemana] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]); // Todos os dias
```

### Passo 3: Adicionar na interface

```tsx
{/* Horário Inicial (para intervalos) */}
<Text style={styles.label}>Horário de Início</Text>
<TextInput
  style={styles.input}
  value={horarioInicio}
  onChangeText={setHorarioInicio}
  placeholder="08:00"
/>

{/* Botão para usar intervalos */}
<TouchableOpacity
  style={styles.intervalButton}
  onPress={() => setShowIntervalModal(true)}
>
  <Text style={styles.intervalButtonText}>
    {intervaloHoras 
      ? `Intervalo: ${intervaloHoras}/${intervaloHoras}h`
      : '🕐 Usar Intervalos'}
  </Text>
</TouchableOpacity>

{/* Modal de seleção de intervalo */}
<IntervalModal
  visible={showIntervalModal}
  onClose={() => setShowIntervalModal(false)}
  onSelect={(interval) => {
    setIntervaloHoras(interval);
    setTipoAgendamento('intervalo');
    // Gerar horários automaticamente
    const horariosGerados = generateScheduleTimes(horarioInicio, interval);
    setHorarios(horariosGerados);
  }}
/>

{/* Lista de horários (editável) */}
<HorariosList
  horarios={horarios}
  onChange={setHorarios}
  editable={true}
/>

{/* Tipo de Duração */}
<Text style={styles.label}>Duração</Text>
<View style={styles.row}>
  <TouchableOpacity
    style={[styles.optionButton, usoContinuo && styles.optionSelected]}
    onPress={() => setUsoContinuo(true)}
  >
    <Text style={styles.optionText}>Uso Contínuo</Text>
  </TouchableOpacity>
  
  <TouchableOpacity
    style={[styles.optionButton, !usoContinuo && styles.optionSelected]}
    onPress={() => setUsoContinuo(false)}
  >
    <Text style={styles.optionText}>Data de Término</Text>
  </TouchableOpacity>
</View>

{/* Se não é uso contínuo, mostrar DatePicker */}
{!usoContinuo && (
  <DateTimePicker
    value={dataFim || new Date()}
    mode="date"
    onChange={(e, date) => setDataFim(date || null)}
  />
)}
```

### Passo 4: Ao salvar, enviar para API

```tsx
const handleSalvar = async () => {
  const medicamento = {
    nome,
    dosagem,
    paciente_id,
    horarios: formatHorariosForDB(horarios), // Converte para JSON
    tipo_agendamento: tipoAgendamento,
    intervalo_horas: intervaloHoras,
    inicio: dataInicio.toISOString().split('T')[0],
    data_fim: usoContinuo ? null : dataFim?.toISOString().split('T')[0],
    uso_continuo: usoContinuo ? 1 : 0,
    dias_semana: diasSemana.join(','), // "0,1,2,3,4,5,6"
  };

  await api.post('/medicamentos', medicamento);
};
```

## 📊 Estrutura de Dados no Banco

```json
{
  "medicamento_id": 1,
  "nome": "Dipirona",
  "dosagem": "500mg",
  "horarios": "[\"08:00\",\"16:00\",\"00:00\"]",
  "tipo_agendamento": "intervalo",
  "intervalo_horas": 8,
  "inicio": "2025-11-12",
  "data_fim": null,
  "uso_continuo": 1,
  "dias_semana": "0,1,2,3,4,5,6",
  "paciente_id": 4
}
```

## 🔄 Como Exibir na Tela Principal

```tsx
import { 
  getActiveMedicationsForDate, 
  getMedicamentoHorarios 
} from '../utils/medicamentoSchedule';

// No useEffect ou função de carregamento
const hoje = new Date();
const medicamentosAtivos = getActiveMedicationsForDate(todosOsMedicamentos, hoje);

// Para cada medicamento ativo
medicamentosAtivos.forEach(med => {
  const horarios = getMedicamentoHorarios(med);
  // Exibir cada horário na interface
  horarios.forEach(horario => {
    console.log(`${med.nome} às ${horario}`);
  });
});
```

## ✨ Vantagens desta Abordagem

### ✅ Performance
- Não cria milhares de registros no banco
- Salva apenas o **padrão recorrente**
- Calcula doses dinamicamente no frontend

### ✅ Flexibilidade
- Usuário pode editar horários individuais
- Pode mudar de intervalo para manual
- Pode adicionar/remover horários à vontade

### ✅ Escalabilidade
- Funciona com uso contínuo (infinito)
- Funciona com data de término definida
- Suporta dias da semana específicos

## 🎯 Próximos Passos (Pendentes)

### 1. Backend - Atualizar Model e Controller
- [ ] Adicionar suporte aos novos campos no `medicamentoModel.js`
- [ ] Validar dados antes de salvar
- [ ] Garantir que `horarios` seja salvo como JSON

### 2. Frontend - Atualizar Tela NovoMedicamento
- [ ] Integrar `IntervalModal` e `HorariosList`
- [ ] Adicionar seleção de dias da semana
- [ ] Adicionar toggle Uso Contínuo / Data de Término
- [ ] Conectar com a API

### 3. Frontend - Atualizar Tela Medicamentos (Listagem)
- [ ] Calcular medicamentos ativos do dia
- [ ] Exibir horários dinamicamente
- [ ] Filtrar por dia da semana
- [ ] Marcar doses como tomadas

## 📝 Exemplo Completo de Uso

```tsx
// 1. Usuário seleciona "8/8 horas"
// 2. Sistema gera: ["08:00", "16:00", "00:00"]
// 3. Usuário edita "00:00" para "23:30"
// 4. Lista final: ["08:00", "16:00", "23:30"]
// 5. Salva no banco: {"horarios": "[\"08:00\",\"16:00\",\"23:30\"]"}
// 6. Na tela principal: calcula dinamicamente se deve exibir hoje
```

## 🐛 Troubleshooting

### Horários não aparecem
- Verifique se `getMedicamentoHorarios()` está sendo usado
- Verifique se o JSON está válido no banco

### Medicamento não aparece no dia
- Use `isActiveMedication()` para debugar
- Verifique `inicio`, `data_fim` e `uso_continuo`

### Intervalo não gera horários
- Verifique se `horarioInicio` está no formato "HH:mm"
- Verifique se `intervalHoras` é 4, 6, 8 ou 12

## 📚 Referências

- Migration: `backend/migrations/001_update_medicamentos_schema.sql`
- Utils: `frontend/src/utils/medicamentoSchedule.ts`
- Componentes: `frontend/src/components/IntervalModal.tsx`, `frontend/src/components/HorariosList.tsx`

---

**Status Atual:** ✅ Migrations OK | ✅ Utils OK | ✅ Componentes OK | ⏳ Integração Pendente
