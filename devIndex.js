if (process.env.NODE_ENV !== 'production') {
  const config = require('./scripts/getBabelConfig')('server');

  require('@babel/register')({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    rootMode: 'upward',
    ...config,
  });
}

require('./src/server/index.ts');
