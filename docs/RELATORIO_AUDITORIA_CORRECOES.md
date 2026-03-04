# Relatório crítico de auditoria – CareHub (backend + frontend)

## 1. Falhas de segurança na API (identificadas e corrigidas)

### 1.1 SQL Injection (crítico) – CORRIGIDO
- **Onde:** `pacienteModel.atualizarPaciente`, `usuarioModel.atualizarUsuario`, `medicamentoModel.atualizarMedicamento`.
- **Problema:** Os nomes das colunas no UPDATE eram montados com `Object.keys(changes)` sem validação. Um cliente poderia enviar algo como `{"nome; DROP TABLE pacientes; --": "x"}` e injetar SQL.
- **Correção:** Definida lista branca de colunas permitidas (`COLUNAS_PERMITIDAS`) em cada model. Apenas chaves presentes nessa lista são usadas no `SET` do UPDATE.

### 1.2 Rotas de medicamentos sem autenticação (crítico) – CORRIGIDO
- **Onde:** `backend/src/routes/medicamentoRoutes.js`.
- **Problema:** GET/POST/PATCH/DELETE de medicamentos não usavam `authMiddleware`. Qualquer pessoa podia listar, criar, alterar e excluir medicamentos de qualquer paciente.
- **Correção:** Todas as rotas de medicamentos passaram a usar `authMiddleware`. Nos controllers, foi adicionada verificação de que o `paciente_id` pertence ao usuário logado (evita acesso a dados de outros).

### 1.3 IDOR (Insecure Direct Object Reference) – CORRIGIDO
- **getPacienteById:** Qualquer usuário autenticado podia pedir dados de qualquer paciente pelo ID. Agora é verificado se `paciente.fk_usuario_id === req.user.usuario_id`.
- **patchPaciente:** Idem; só o dono do paciente pode editar.
- **perfil (GET /usuarios/perfil/:id):** Era possível pedir o perfil de outro usuário. Agora só é permitido quando `id === req.user.usuario_id`.
- **patchUsuario:** Era possível alterar outro usuário. Agora só quando `id === req.user.usuario_id`.
- **deleteRegistro (diário):** Exclusão era feita só por `registro_id`; qualquer usuário podia apagar registro de outro. Agora o DELETE usa `registro_id` e `usuario_id` (do token), garantindo que só o dono exclui.
- **Tarefas:** getTarefas, createTarefa, getTarefaById, updateTarefa e deleteTarefa passaram a verificar, via `pacientePertenceAoUsuario`, que o paciente pertence ao usuário.
- **Medicamentos:** getMedicamentos, createMedicamento, patchMedicamento e deleteMedicamento passaram a verificar que o paciente do recurso pertence ao usuário.

### 1.4 Exposição de dados sensíveis
- **Login/cadastro:** A API já não retorna `senha_hash`; `buscarPorId` já seleciona apenas campos seguros (nome, email, tipo, etc.). Nenhuma alteração necessária além das de IDOR acima.

### 1.5 Dependência bcrypt – CORRIGIDO
- **Onde:** `usuarioController.js` importava `bcryptjs` enquanto o `package.json` do backend declara `bcrypt`.
- **Correção:** Import alterado para `bcrypt` (pacote instalado).

---

## 2. Banco de dados (schema e otimização)

### 2.1 Schema atual
- O `banco.sql` define as tabelas: `usuarios`, `pacientes`, `tarefas`, `medicamentos`, `diario_registros`.
- A documentação em `docs/AGENDAMENTO_MEDICAMENTOS.md` cita colunas adicionais em medicamentos (`tipo_agendamento`, `intervalo_horas`, `data_fim`, `dias_semana`). Se a sua base já tiver sido migrada com `001_update_medicamentos_schema.sql`, o schema está alinhado; caso contrário, é preciso aplicar essa migration.

### 2.2 Otimização para as consultas – FEITO
- Foram adicionados índices em `banco.sql` para as consultas mais usadas:
  - `pacientes (fk_usuario_id)` – listar pacientes do usuário.
  - `tarefas (paciente_id)` e `tarefas (data)` – listar tarefas por paciente e por data.
  - `medicamentos (paciente_id)` – listar medicamentos por paciente.
  - `diario_registros (paciente_id)`, `diario_registros (usuario_id)` e `(registro_id, usuario_id)` – listagem e DELETE seguro por usuário.
- **Observação:** Em bancos já existentes, execute apenas os `CREATE INDEX` (no final do `banco.sql`). Se algum índice já existir, ignore o erro ou use um script que trate “index already exists”.

---

## 3. Frontend – re-renderizações e performance

### 3.1 Problemas apontados e correções

1. **Tarefas.tsx**
   - `marcarDias()` era chamada no render e devolvia um objeto novo a cada render, fazendo o `Calendar` re-renderizar sempre.
   - **Correção:** `marcarDias` virou um valor calculado com `useMemo` (dependências: `tarefas`, `dataSelecionada`, `colors.primary`). O `Calendar` passou a receber `markedDates={marcarDias}` (valor estável).
   - `tarefasDoDia` era `tarefas.filter(...)` a cada render.
   - **Correção:** `useMemo` com dependências `[tarefas, dataSelecionada]`.

2. **Medicamentos.tsx**
   - `medicamentosDoDia` era um `filter` em todo render.
   - **Correção:** `useMemo` com dependências `[medicamentos, selectedDate]`.

3. **Home.tsx**
   - `useFocusEffect` chamava `load()` em todo foco da tela (AsyncStorage + várias APIs), causando carga pesada e desnecessária ao trocar de aba.
   - Havia risco de “duplo carregamento”: `load()` no foco e depois `useEffect` em `paciente` chamando `carregarDashboard()`.
   - **Correção:** No foco, só é chamado `carregarDashboard()` quando já existe `paciente` (atualização leve das contagens). O carregamento completo (`load()`) permanece apenas no mount (useEffect inicial). `carregarDashboard` foi envolvido em `useCallback` e as requisições de tarefas, medicamentos e diário foram agrupadas em `Promise.all` para reduzir tempo de resposta.

### 3.2 Outras observações (não alteradas)
- **ThemeContext:** `colors` é derivado de constantes (LIGHT/DARK), sem novo objeto a cada render; ok.
- **FlatList:** O `renderItem` usa função inline; em listas muito grandes, extrair um componente de item e usar `React.memo` pode trazer ganho adicional; não foi alterado nesta rodada.

---

## 4. Plano de execução (resumo do que foi feito)

| # | Item | Status |
|---|------|--------|
| 1 | SQL Injection: whitelist de colunas em PATCH (paciente, usuario, medicamento) | ✅ |
| 2 | Rotas de medicamentos: adicionar authMiddleware em todas | ✅ |
| 3 | IDOR: getPacienteById, perfil, patchUsuario, patchPaciente, deleteRegistro, tarefas e medicamentos | ✅ |
| 4 | Trocar import bcryptjs → bcrypt no usuarioController | ✅ |
| 5 | Índices no banco para consultas frequentes (banco.sql) | ✅ |
| 6 | useMemo em Tarefas (marcarDias, tarefasDoDia) e Medicamentos (medicamentosDoDia) | ✅ |
| 7 | Home: evitar load completo no foco; useCallback em carregarDashboard; Promise.all no dashboard | ✅ |

---

## 5. Recomendações adicionais (não implementadas)

- **CORS:** Manter `cors()` configurado em produção apenas para origens confiáveis (ex.: domínio do app).
- **JWT:** Usar `JWT_SECRET` forte e preferir token com tempo de vida curto e refresh token.
- **Rate limiting:** Adicionar limite de requisições por IP/usuário nas rotas de login e cadastro.
- **Logs:** Evitar logar dados sensíveis (senha, token). Os `console.log` de debug no frontend podem ser removidos ou condicionados a `__DEV__`.
- **Banco existente:** Se já tiver tabelas criadas, rodar só os `CREATE INDEX` do final do `banco.sql` (e tratar “index already exists” se for o caso).

As correções de segurança e performance acima foram aplicadas nos arquivos do backend e do frontend conforme indicado neste relatório.
