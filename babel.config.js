const getBabelConfig = require('./scripts/getBabelConfig');

module.exports = {
  overrides: [
    {
      test: ['./packages/*', './cypress/*'],
      ...getBabelConfig(process.env.SERVER ? 'server' : 'client'),
    },
  ],
  babelrcRoots: ['./packages/*'],
};
