const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Vamos excluir o diretório backend do bundler, porque né, não precisamos dele aqui
config.resolver.blockList = [
  /backend\/.*/,
  /node_modules\/.*\/backend\/.*/,
];

module.exports = config;
