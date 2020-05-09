if (process.env.NODE_ENV !== 'production') {
  const config = require('./scripts/getBabelConfig')('server');

  // eslint-disable-next-line import/no-extraneous-dependencies
  require('@babel/register')({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    rootMode: 'upward',
    ...config,
  });
}

require('./packages/server/index.ts');
