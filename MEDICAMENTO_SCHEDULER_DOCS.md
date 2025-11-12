# 🏥 Sistema de Agendamento Inteligente de Medicamentos

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Migração do Banco de Dados](#migração-do-banco-de-dados)
3. [Estrutura de Dados](#estrutura-de-dados)
4. [Componentes Frontend](#componentes-frontend)
5. [Como Integrar na Tela NovoMedicamento](#como-integrar)
6. [Exemplo de Uso Completo](#exemplo-completo)
7. [API Reference](#api-reference)

---

## 🎯 Visão Geral

Este sistema permite que usuários criem medicamentos com horários automáticos baseados em intervalos (4/4h, 6/6h, 8/8h, 12/12h) ou horários manuais.

### Funcionalidades:
- ✅ Geração automática de horários por intervalo
- ✅ Edição individual de cada horário gerado
- ✅ Remoção de horários específicos
- ✅ Suporte a "Uso Contínuo" (sem data de término)
- ✅ Suporte a data de término fixa
- ✅ Restrição por dias da semana
- ✅ Cálculo dinâmico de doses ativas por dia

---

## 🗄️ Migração do Banco de Dados

### Passo 1: Executar Migration

Execute no MySQL da sua VPS:

```bash
mysql -u root -p carehub_db < /var/www/CareHubApp/backend/migrations/001_update_medicamentos_schema.sql
```

Ou se estiver usando MySQL < 5.7 (sem suporte a JSON):

```bash
mysql -u root -p carehub_db < /var/www/CareHubApp/backend/migrations/001_update_medicamentos_schema_legacy.sql
```

### Campos Adicionados:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `tipo_agendamento` | ENUM('manual', 'intervalo') | Define se os horários foram criados manualmente ou por intervalo |
| `intervalo_horas` | INT | Intervalo em horas (4, 6, 8, 12) |
| `data_fim` | DATE | Data de término (NULL se uso contínuo) |
| `dias_semana` | VARCHAR(50) | Dias da semana para repetir (ex: "0,1,2,3,4,5,6") |
| `horarios` | JSON ou TEXT | Array de horários ["08:00", "16:00", "00:00"] |

---

## 📦 Estrutura de Dados

### Exemplo de Medicamento (JSON):

```json
{
  "medicamento_id": 123,
  "nome": "Dipirona",
  "dosagem": "500mg",
  "horarios": ["08:00", "16:00", "00:00"],
  "tipo_agendamento": "intervalo",
  "intervalo_horas": 8,
  "inicio": "2025-11-12",
  "data_fim": null,
  "uso_continuo": 1,
  "dias_semana": "0,1,2,3,4,5,6",
  "paciente_id": 4
}
```

---

## 🧩 Componentes Frontend

### 1. `IntervaloModal`
Modal para seleção de intervalo (4/4h, 6/6h, 8/8h, 12/12h).

**Props:**
```typescript
interface IntervaloModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectIntervalo: (intervalHours: number) => void;
  intervaloAtual?: number;
}
```

### 2. `HorariosList`
Lista de horários com botões para editar/remover.

**Props:**
```typescript
interface HorariosListProps {
  horarios: string[];
  onChange: (novosHorarios: string[]) => void;
  editable?: boolean;
}
```

### 3. Funções Utilitárias (`medicamentoScheduler.ts`)

```typescript
// Gera horários automaticamente
generateScheduleTimes("12:00", 8) 
// => ["12:00", "20:00", "04:00"]

// Verifica se medicamento está ativo hoje
isMedicamentoAtivoNaData(medicamento, new Date())
// => true/false

// Obtém medicamentos ativos para uma data
getMedicamentosParaData(medicamentos, new Date())
// => [{ medicamento, horarios }]
```

---

## 🔧 Como Integrar na Tela NovoMedicamento

### Código Exemplo (com comentários):

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import IntervaloModal from '../components/IntervaloModal';
import HorariosList from '../components/HorariosList';
import { generateScheduleTimes } from '../utils/medicamentoScheduler';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../config/api';

export default function NovoMedicamento({ route, navigation }: any) {
  const { paciente_id } = route.params;

  // Estados
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [horarios, setHorarios] = useState<string[]>([]);
  const [tipoAgendamento, setTipoAgendamento] = useState<'manual' | 'intervalo'>('manual');
  const [intervaloHoras, setIntervaloHoras] = useState<number | null>(null);
  const [usoContinuo, setUsoContinuo] = useState(true);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const [diasSemana, setDiasSemana] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]); // Todos os dias
  
  const [showIntervaloModal, setShowIntervaloModal] = useState(false);
  const [showTimePickerInicio, setShowTimePickerInicio] = useState(false);
  const [horarioInicio, setHorarioInicio] = useState(new Date());

  // Quando usuário seleciona um intervalo
  const handleSelectIntervalo = (interval: number) => {
    // Pede horário inicial
    setShowTimePickerInicio(true);
    setIntervaloHoras(interval);
    setTipoAgendamento('intervalo');
  };

  // Quando horário inicial é selecionado
  const handleTimePickerInicio = (event: any, selectedDate?: Date) => {
    setShowTimePickerInicio(false);
    
    if (event.type === 'set' && selectedDate && intervaloHoras) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const startTime = `${hours}:${minutes}`;
      
      // Gera horários automaticamente
      const novosHorarios = generateScheduleTimes(startTime, intervaloHoras);
      setHorarios(novosHorarios);
      
      Alert.alert(
        'Horários gerados!',
        `${novosHorarios.length} horários criados: ${novosHorarios.join(', ')}`
      );
    }
  };

  // Salvar medicamento
  const handleSalvar = async () => {
    if (!nome || !dosagem || horarios.length === 0) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const medicamento = {
      nome,
      dosagem,
      horarios, // Array: ["08:00", "16:00", "00:00"]
      tipo_agendamento: tipoAgendamento,
      intervalo_horas: intervaloHoras,
      inicio: dataInicio.toISOString().split('T')[0],
      data_fim: usoContinuo ? null : dataFim?.toISOString().split('T')[0],
      uso_continuo: usoContinuo ? 1 : 0,
      dias_semana: diasSemana.join(','),
      paciente_id,
      concluido: 0,
    };

    try {
      await api.post('/medicamentos', medicamento);
      Alert.alert('Sucesso', 'Medicamento cadastrado!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível cadastrar o medicamento');
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <TextInput
        placeholder="Nome do medicamento"
        value={nome}
        onChangeText={setNome}
      />
      
      <TextInput
        placeholder="Dosagem (ex: 500mg)"
        value={dosagem}
        onChangeText={setDosagem}
      />

      {/* Botão para usar intervalos */}
      <TouchableOpacity onPress={() => setShowIntervaloModal(true)}>
        <Text>🕐 Usar intervalos</Text>
      </TouchableOpacity>

      {/* Lista de horários (editável) */}
      <HorariosList
        horarios={horarios}
        onChange={setHorarios}
        editable={true}
      />

      {/* Switch: Uso Contínuo */}
      <TouchableOpacity onPress={() => setUsoContinuo(!usoContinuo)}>
        <Text>{usoContinuo ? '✓' : '○'} Uso Contínuo</Text>
      </TouchableOpacity>

      {/* Data de início */}
      <Text>Data de início: {dataInicio.toLocaleDateString()}</Text>

      {/* Data de fim (só aparece se não for uso contínuo) */}
      {!usoContinuo && (
        <>
          <Text>Data de término:</Text>
          {/* DatePicker para dataFim */}
        </>
      )}

      {/* Dias da semana */}
      <Text>Repetir em:</Text>
      {/* Checkboxes para dias da semana */}

      {/* Botão Salvar */}
      <TouchableOpacity onPress={handleSalvar}>
        <Text>Salvar Medicamento</Text>
      </TouchableOpacity>

      {/* Modals */}
      <IntervaloModal
        visible={showIntervaloModal}
        onClose={() => setShowIntervaloModal(false)}
        onSelectIntervalo={handleSelectIntervalo}
        intervaloAtual={intervaloHoras}
      />

      {showTimePickerInicio && (
        <DateTimePicker
          value={horarioInicio}
          mode="time"
          is24Hour={true}
          onChange={handleTimePickerInicio}
        />
      )}
    </ScrollView>
  );
}
```

---

## 📱 Tela de Medicamentos (Listagem)

Na tela principal de medicamentos, você deve calcular dinamicamente quais medicamentos e horários exibir para o dia atual:

```typescript
import { getMedicamentosParaData } from '../utils/medicamentoScheduler';

const [medicamentosAtivos, setMedicamentosAtivos] = useState<any[]>([]);

useEffect(() => {
  // Buscar medicamentos do backend
  const fetchMedicamentos = async () => {
    const response = await api.get(`/medicamentos?paciente_id=${paciente_id}`);
    const todosMedicamentos = response.data;
    
    // Filtrar apenas medicamentos ativos para hoje
    const hoje = new Date();
    const ativosHoje = getMedicamentosParaData(todosMedicamentos, hoje);
    
    setMedicamentosAtivos(ativosHoje);
  };

  fetchMedicamentos();
}, []);

// Renderizar
{medicamentosAtivos.map(({ medicamento, horarios }) => (
  <View key={medicamento.medicamento_id}>
    <Text>{medicamento.nome} - {medicamento.dosagem}</Text>
    {horarios.map((horario, idx) => (
      <Text key={idx}>⏰ {horario}</Text>
    ))}
  </View>
))}
```

---

## 🔑 API Reference

### Funções Utilitárias

#### `generateScheduleTimes(startTime, intervalHours)`
Gera lista de horários com base em intervalo.

**Params:**
- `startTime` (string): Horário inicial "HH:MM"
- `intervalHours` (number): 4, 6, 8 ou 12

**Returns:** `string[]` - Array de horários

**Exemplo:**
```typescript
generateScheduleTimes("08:00", 8)
// => ["08:00", "16:00", "00:00"]
```

---

#### `isMedicamentoAtivoNaData(medicamento, targetDate)`
Verifica se medicamento está ativo em uma data.

**Params:**
- `medicamento` (object): Objeto do medicamento
- `targetDate` (Date): Data para verificar

**Returns:** `boolean`

**Exemplo:**
```typescript
isMedicamentoAtivoNaData(medicamento, new Date())
// => true
```

---

#### `getMedicamentosParaData(medicamentos, targetDate)`
Retorna medicamentos ativos para uma data específica.

**Params:**
- `medicamentos` (array): Lista de medicamentos
- `targetDate` (Date): Data alvo (padrão: hoje)

**Returns:** `Array<{ medicamento, horarios }>`

**Exemplo:**
```typescript
const ativosHoje = getMedicamentosParaData(medicamentos, new Date());
// => [
//   { 
//     medicamento: { nome: "Dipirona", ... },
//     horarios: ["08:00", "16:00", "00:00"]
//   }
// ]
```

---

## ✅ Checklist de Implementação

### Backend:
- [x] Executar migration do banco de dados
- [x] Atualizar `medicamentoModel.js`
- [x] Atualizar `medicamentoController.js`
- [ ] Fazer pull na VPS e reiniciar backend

### Frontend:
- [x] Criar `medicamentoScheduler.ts` (utils)
- [x] Criar `IntervaloModal.tsx` (component)
- [x] Criar `HorariosList.tsx` (component)
- [ ] Atualizar tela `NovoMedicamento.tsx`
- [ ] Atualizar tela `Medicamentos.tsx` (listagem)
- [ ] Testar fluxo completo

---

## 🚀 Deploy

1. **Commitar e fazer push:**
```bash
git add .
git commit -m "feat: adiciona sistema de agendamento inteligente de medicamentos"
git push origin main
```

2. **Na VPS:**
```bash
cd /var/www/CareHubApp
git pull origin main
mysql -u root -p carehub_db < backend/migrations/001_update_medicamentos_schema.sql
cd backend && npm start
```

3. **No React Native:**
```bash
npm install
npx expo start
```

---

## 💡 Dicas

1. **Validação de horários:** Use `isHorarioValido()` antes de salvar
2. **Performance:** Os horários são calculados dinamicamente, não há milhares de registros no banco
3. **Edição:** Usuário pode editar cada horário individualmente mesmo após geração automática
4. **Dias da semana:** Se deixar `dias_semana` vazio, medicamento será para todos os dias

---

## 🐛 Troubleshooting

**Problema:** Horários não aparecem
**Solução:** Verifique se o backend está retornando array de horários (JSON.parse)

**Problema:** Data aparece errada
**Solução:** Use sempre `.split("T")[0]` para evitar problemas de timezone

**Problema:** Não consigo editar horários
**Solução:** Garanta que `editable={true}` no componente HorariosList

---

## 📞 Suporte

Se tiver dúvidas, basta perguntar! 🚀
