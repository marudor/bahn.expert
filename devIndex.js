if (process.env.NODE_ENV !== 'production') {
  const config = require('./scripts/getBabelConfig.cjs')('server');

  // eslint-disable-next-line import/no-extraneous-dependencies
  require('@babel/register')({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    rootMode: 'upward',
    ...config,
  });
}

require('./src/server/index.ts');
