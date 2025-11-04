// Arquivo: index.ts (na raiz do projeto)

import { registerRootComponent } from 'expo';
import 'expo/AppEntry'; // Importante para o Expo funcionar
import App from './App'; // Importa o SEU arquivo App.tsx

// Define o App.tsx como o início de tudo
registerRootComponent(App);