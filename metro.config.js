const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

/*
 * To enable JavaScript obfuscation:
 * 1. Install dependencies: npm install --save-dev javascript-obfuscator react-native-obfuscating-transformer
 * 2. Uncomment the transformation block below.
 *
 * NOTE: Obfuscation increases build time and can make debugging harder.
 * It is recommended to only enable it for production builds.
 */

/*
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

config.transformer.babelTransformerPath = require.resolve('react-native-obfuscating-transformer');
*/

module.exports = config;
