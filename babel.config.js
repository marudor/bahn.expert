const getBabelConfig = require('./scripts/getBabelConfig');

module.exports = {
  overrides: [
    {
      test: ['./src/*', './packages/*', './test/*', './cypress/*'],
      ...getBabelConfig(process.env.SERVER ? 'server' : 'client'),
    },
  ],
  babelrcRoots: ['./packages/*'],
};
