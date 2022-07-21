const getBabelConfig = require('./scripts/getBabelConfig.cjs');

module.exports = {
  overrides: [
    {
      test: ['./src/*', './cypress/*'],
      ...getBabelConfig(process.env.SERVER ? 'server' : 'client'),
    },
  ],
  babelrcRoots: ['./src/*'],
};
