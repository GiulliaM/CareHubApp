const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Excluir o diretório backend do bundler
config.resolver.blockList = [
  /backend\/.*/,
  /node_modules\/.*\/backend\/.*/,
];

module.exports = config;
