# CareHub - Aplicativo de Cuidados

Aplicativo React Native (Expo) para gerenciamento de cuidados de pacientes, com backend Node.js/Express e banco MySQL.

---

## Passo a passo: Iniciar o app via depuração ADB (dispositivo físico)

### Pre-requisitos

1. **Node.js** (v18+) instalado na maquina
2. **Expo CLI** instalado globalmente:
   ```bash
   npm install -g expo-cli
   ```
3. **ADB** (Android Debug Bridge) instalado. Vem com o Android Studio ou pode ser instalado separadamente:
   ```bash
   sudo apt install adb
   ```
4. **Celular Android** com:
   - **Opcoes do Desenvolvedor** ativadas (toque 7 vezes em "Numero da versao" em Configuracoes > Sobre o telefone)
   - **Depuracao USB** ativada (dentro de Opcoes do Desenvolvedor)
5. **Cabo USB** conectando o celular ao computador
6. **Expo Go** instalado no celular (baixe pela Play Store)

### Passo 1: Verificar conexao ADB

Conecte o celular via USB e execute:

```bash
adb devices
```

Deve aparecer algo como:

```
List of devices attached
XXXXXXXX    device
```

Se aparecer `unauthorized`, desbloqueie o celular e aceite a permissao de depuracao USB.

### Passo 2: Iniciar o backend

Abra um terminal na raiz do projeto:

```bash
cd backend
npm install        # apenas na primeira vez
npm run dev        # inicia o servidor com hot-reload
```

O servidor vai iniciar na porta 3000. Verifique os logs:

```
--- DIAGNOSTICO DE AMBIENTE ---
JWT_SECRET Carregado      : SIM
DB_USER                   : carehub_user
Servidor CareHub rodando na porta 3000
```

### Passo 3: Configurar IP da API

Se estiver testando localmente (backend na sua maquina), edite o arquivo `frontend/src/config/api.ts`:

```typescript
const AMBIENTE: 'vps' | 'local' = 'local';   // mude para 'local'
```

E atualize o IP local se necessario:

```typescript
const URLS = {
  vps: 'http://163.245.203.21:3000/api',
  local: Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api'     // emulador
    : 'http://localhost:3000/api',
};
```

**Para dispositivo fisico via ADB**, use o IP da sua maquina na rede Wi-Fi (ex: `192.168.15.16`):

```typescript
local: 'http://192.168.15.16:3000/api',
```

Ou use o redirecionamento de porta do ADB (recomendado):

```bash
adb reverse tcp:3000 tcp:3000
```

Com isso, `http://localhost:3000` no celular aponta para a porta 3000 da sua maquina. Nesse caso, configure:

```typescript
local: 'http://localhost:3000/api',
```

### Passo 4: Iniciar o Expo

Abra outro terminal na **raiz do projeto**:

```bash
npm install       # apenas na primeira vez
npx expo start
```

Opcoes de inicializacao:

| Comando                    | Descricao                                       |
|----------------------------|------------------------------------------------|
| `npx expo start`           | Inicia o bundler (escanear QR code)            |
| `npx expo start --tunnel`  | Usa ngrok para acesso remoto (mais lento)      |
| `npx expo start --android` | Abre direto no dispositivo/emulador Android    |

### Passo 5: Abrir no celular

**Opcao A — Via ADB (mais rapido):**

Com o celular conectado e o Expo rodando, pressione `a` no terminal do Expo. Ele vai abrir o app automaticamente no celular via ADB.

**Opcao B — Via QR Code:**

Escaneie o QR code exibido no terminal com o app Expo Go.

**Opcao C — Via URL manualmente:**

No Expo Go, toque em "Enter URL manually" e digite a URL que aparece no terminal (ex: `exp://192.168.15.16:8081`).

### Passo 6: Monitorar logs

**Logs do Expo (frontend):**

```bash
# Os logs ja aparecem no terminal onde o Expo esta rodando
# Para filtrar logs do dispositivo via ADB:
adb logcat *:S ReactNativeJS:V ReactNative:V
```

**Logs do backend:**

```bash
# No terminal onde o backend esta rodando, os logs ja aparecem
# Se usar PM2 na VPS:r
pm2 logs carehub-api
```

### Passo 7: Hot reload

Ao salvar alteracoes no codigo:
- **Frontend**: o Expo faz hot reload automatico no celular
- **Backend**: o `npm run dev` usa `--watch` e reinicia automaticamente

### Resolucao de problemas comuns

| Problema | Solucao |
|----------|---------|
| `adb devices` mostra vazio | Verifique cabo USB e depuracao USB ativada |
| `Network Error` no app | Verifique IP em `config/api.ts` e se o backend esta rodando |
| `JWT_SECRET nao definido` | Verifique o arquivo `backend/.env` |
| App nao abre pelo Expo | Tente `adb reverse tcp:3000 tcp:3000` e reinicie |
| QR Code nao funciona | Use `npx expo start --tunnel` ou conecte na mesma rede Wi-Fi |

---

## Sistema de Notificacoes - Documentacao completa

### Visao geral

O CareHub usa **expo-notifications** para enviar lembretes locais de tarefas. As notificacoes sao **agendadas localmente** no dispositivo (nao dependem de servidor push).

### Arquitetura

```
app.json                         → Configura plugin expo-notifications + som customizado
App.tsx                          → Define handler de notificacoes em foreground
frontend/src/utils/notificacoes.ts  → Logica de agendamento/cancelamento
frontend/src/screens/Configuracoes.tsx → UI para ativar/desativar lembretes
frontend/src/screens/NovaTarefa.tsx    → Agenda lembrete ao criar tarefa
frontend/src/screens/Tarefas.tsx       → Cancela lembrete ao excluir tarefa
assets/sounds/notificacao.wav          → Som customizado (opcional)
```

### Configuracao no app.json

```json
{
  "plugins": [
    [
      "expo-notifications",
      {
        "sounds": ["./assets/sounds/notificacao.wav"],
        "defaultChannel": "carehub-lembretes"
      }
    ]
  ]
}
```

- `sounds`: lista de arquivos de som a incluir no build nativo
- `defaultChannel`: ID do canal Android padrao

### Handler de foreground (App.tsx)

```typescript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,   // exibe o alerta mesmo com o app aberto
    shouldPlaySound: true,   // toca o som
    shouldSetBadge: false,   // nao altera badge do icone
  }),
});
```

Isso garante que a notificacao apareca visualmente **mesmo quando o app esta em primeiro plano**.

### Servico de notificacoes (notificacoes.ts)

#### Funcoes disponiveis

| Funcao | Descricao |
|--------|-----------|
| `configurarCanal()` | Pede permissao e cria canal Android "Lembretes de tarefas" com prioridade HIGH |
| `agendarLembreteTarefa(tarefaId, titulo, data, hora)` | Agenda notificacao local para data/hora especifica |
| `cancelarLembreteTarefa(tarefaId)` | Cancela lembrete de uma tarefa especifica |
| `cancelarTodosLembretes()` | Cancela todos os lembretes de tarefas pendentes |
| `notificacoesLembreteAtivas()` | Verifica se lembretes estao ativados (AsyncStorage) |
| `setNotificacoesLembreteAtivas(ativo)` | Ativa/desativa lembretes (AsyncStorage) |

#### Fluxo de agendamento

1. Usuario cria tarefa com data e hora em `NovaTarefa.tsx`
2. `agendarLembreteTarefa()` e chamada com os dados da tarefa
3. A funcao verifica se lembretes estao ativados
4. Se sim, solicita permissao (se necessario)
5. Cancela qualquer notificacao anterior com o mesmo ID
6. Agenda nova notificacao para a data/hora especificada
7. O identificador segue o padrao: `"tarefa_" + tarefaId`

#### Fluxo de cancelamento

- Ao **excluir uma tarefa**: `cancelarLembreteTarefa(tarefaId)` e chamada
- Ao **desativar lembretes** nas configuracoes: `cancelarTodosLembretes()` remove todos

### Canal Android

O canal `carehub-lembretes` e configurado com:
- Nome: "Lembretes de tarefas"
- Importancia: HIGH (aparece na barra de status e faz som)
- Vibracao: ativada

### Som customizado

#### Status atual

O som esta configurado para usar `sound: true` no conteudo da notificacao, o que usa o **som padrao do sistema**.

#### Como ativar som customizado

1. **Coloque o arquivo de audio** em `assets/sounds/`:
   - `notificacao.wav` (recomendado, ja configurado no app.json)
   - Ou `notificacao.mp3`
   - Formato: ate 30 segundos
   - iOS aceita: .wav, .caf, .aiff
   - Android aceita: .wav, .mp3

2. **Altere o codigo** em `frontend/src/utils/notificacoes.ts`:
   
   Na funcao `agendarLembreteTarefa`, troque:
   ```typescript
   sound: true,
   ```
   Por:
   ```typescript
   sound: "notificacao.wav",
   ```

   Na funcao `configurarCanal`, adicione o som ao canal:
   ```typescript
   await Notifications.setNotificationChannelAsync(CANAL_ID, {
     name: "Lembretes de tarefas",
     importance: Notifications.AndroidImportance.HIGH,
     enableVibrate: true,
     sound: "notificacao.wav",  // adicione esta linha
   });
   ```

3. **Faca um novo build nativo** (o som customizado nao funciona no Expo Go):
   ```bash
   npx expo run:android
   # ou, com EAS Build:
   eas build --platform android --profile development
   ```

### Como testar notificacoes

#### Teste rapido (notificacao imediata)

No celular com o app aberto, abra o console do Expo (pressione `j` no terminal) e execute:

```javascript
// Ou adicione temporariamente no codigo de qualquer tela:
import * as Notifications from "expo-notifications";

// Dispara notificacao em 5 segundos
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Teste CareHub",
    body: "Se voce esta vendo isso, as notificacoes estao funcionando!",
    sound: true,
  },
  trigger: { seconds: 5, channelId: "carehub-lembretes" },
});
```

#### Teste via criacao de tarefa

1. Abra o app e va em **Tarefas**
2. Crie uma nova tarefa com data de **hoje** e hora **2-3 minutos no futuro**
3. Salve a tarefa
4. Minimize o app ou bloqueie a tela
5. Aguarde — a notificacao deve aparecer no horario definido

#### Teste via configuracoes

1. Va em **Perfil → Notificacoes e lembretes**
2. Desative o switch de lembretes → todas as notificacoes pendentes sao canceladas
3. Ative novamente → futuras tarefas agendarao notificacoes
4. Crie uma tarefa nova para verificar

#### Verificar notificacoes agendadas (debug)

Adicione temporariamente em qualquer tela:

```typescript
import * as Notifications from "expo-notifications";

const pendentes = await Notifications.getAllScheduledNotificationsAsync();
console.log("Notificacoes agendadas:", pendentes.length);
pendentes.forEach(n => {
  console.log(`  ID: ${n.identifier}, Titulo: ${n.content.title}, Trigger:`, n.trigger);
});
```

#### Monitorar via ADB

```bash
# Ver todas as notificacoes em tempo real:
adb shell dumpsys notification --noredact | grep -A 5 "CareHub"

# Ver canais de notificacao registrados:
adb shell dumpsys notification | grep "carehub"

# Ver logs de notificacao do app:
adb logcat *:S ReactNativeJS:V | grep -i "notif"
```

### Limitacoes conhecidas

- **Expo Go**: som customizado NAO funciona no Expo Go, apenas em builds nativos (`expo run:android` ou EAS Build)
- **Android 13+**: o usuario precisa conceder permissao de notificacao explicitamente
- **Doze Mode**: em dispositivos com economia de bateria agressiva, notificacoes podem atrasar
- **Reinicio do dispositivo**: notificacoes agendadas localmente podem ser perdidas ao reiniciar o celular

---

## Estrutura do projeto

```
CareHubApp-main/
├── App.tsx                    # Ponto de entrada (ThemeProvider + Navegador)
├── app.json                   # Configuracao Expo
├── package.json               # Dependencias frontend
├── assets/sounds/             # Sons de notificacao
├── backend/
│   ├── .env                   # Variaveis de ambiente
│   ├── banco.sql              # Schema do banco de dados
│   ├── package.json           # Dependencias backend
│   └── src/
│       ├── server.js          # Ponto de entrada do servidor
│       ├── app.js             # Configuracao Express + rotas
│       ├── config/db.js       # Pool de conexao MySQL
│       ├── middleware/        # Middleware de autenticacao
│       ├── models/            # Camada de acesso a dados
│       ├── controllers/       # Logica de negocios das rotas
│       └── routes/            # Definicao de endpoints da API
└── frontend/src/
    ├── screens/               # Telas do aplicativo
    ├── navigation/            # Navegacao (Stack + Tabs)
    ├── context/               # Contextos React (tema)
    ├── components/            # Componentes reutilizaveis
    ├── utils/                 # Utilitarios (API, auth, notificacoes)
    └── config/                # Configuracoes (URL da API, cores)
```
