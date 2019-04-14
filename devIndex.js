if (process.env.NODE_ENV !== 'production') {
  const config = require('./.babelrc.server');

  require('@babel/register')({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    ...config,
  });
}

require('./src/server/index.ts');
