const getBabelConfig = require('./scripts/getBabelConfig');

module.exports = {
  overrides: [
    {
      test: ['./packages/*', './cypress/*'],
      exclude: ['./packages/app'],
      ...getBabelConfig(process.env.SERVER ? 'server' : 'client'),
    },
    {
      test: ['./packages/app/*', './node_modules/react-native/*'],
      presets: ['module:metro-react-native-babel-preset'],
    },
  ],
  babelrcRoots: ['./packages/*'],
};
