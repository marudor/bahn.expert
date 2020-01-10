/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');

module.exports = {
  projectRoot: path.resolve('src/app'),
  watchFolders: [path.resolve('node_modules'), path.resolve('src/shared')],
  resolver: {
    extraNodeModules: {
      shared: path.resolve('src/shared'),
    },
  },
  transformer: {
    // eslint-disable-next-line require-await
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
