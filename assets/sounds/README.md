# Som da notificação de lembrete (tarefas)

## Onde colocar o áudio

Coloque o arquivo de notificação nesta pasta com um dos nomes:

- **notificacao.wav** (recomendado; já configurado no app.json)
- **notificacao.mp3**

Caminho completo no projeto:

```
CareHubApp-main/assets/sounds/notificacao.wav
```

## Como funciona

- O **app.json** já está configurado com o plugin `expo-notifications` e o som `./assets/sounds/notificacao.wav`.
- Se o arquivo **existir** nesse caminho, o build (ex.: `eas build` ou `npx expo run:android`) incluirá o som e as notificações de lembrete poderão usá-lo.
- Se o arquivo **não existir**, o app continua funcionando e usa o som padrão do sistema.
- Para usar o som customizado no código, em `frontend/src/utils/notificacoes.ts` altere `sound: true` para `sound: "notificacao.wav"` no conteúdo da notificação e no canal Android (quando o arquivo já estiver na pasta).

## Formatos

- **iOS:** .wav, .caf, .aiff (até ~30 s).
- **Android:** .wav ou .mp3 (incluídos via plugin no build).
