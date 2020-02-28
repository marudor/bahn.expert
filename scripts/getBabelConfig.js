const fs = require('fs');
const path = require('path');

const getBabelConfig = type => {
  const isServer = type === 'server';

  const presetEnvTargets = isServer
    ? {
        targets: {
          node: 'current',
        },
      }
    : undefined;

  const serverModuleResolver = isServer
    ? {
        extensions: ['.js', '.jsx', '.web.ts', '.ts', '.tsx'],
        alias: {
          testHelper: './test/testHelper',
          classnames: 'clsx',
        },
        resolvePath: (sourcePath, currentFile, opts) => {
          let filePath = require('babel-plugin-module-resolver').resolvePath(
            sourcePath.replace(/^(Abfahrten|Common|Routing)\//, 'client/$1/'),
            currentFile,
            opts
          );
          const specialCase = `${filePath}/index.web.ts`;

          if (
            // eslint-disable-next-line no-sync
            fs.existsSync(path.resolve(path.dirname(currentFile), specialCase))
          ) {
            filePath = specialCase;
          }

          return filePath;
        },
      }
    : undefined;

  const plugins = [
    [
      'babel-plugin-const-enum',
      {
        transform: 'constObject',
      },
    ],
    '@loadable/babel-plugin',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'babel-plugin-parameter-decorator',
    './scripts/babelTransform/debugStyleNames.js',
    'lodash',
    [
      'module-resolver',
      {
        root: 'src',
        ...serverModuleResolver,
      },
    ],
    '@babel/plugin-transform-react-constant-elements',
  ];

  if (isServer) {
    plugins.push([
      'transform-require-ignore',
      {
        extensions: ['.scss', '.css'],
      },
    ]);
  }

  const config = {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          ...presetEnvTargets,
          loose: true,
          useBuiltIns: 'usage',
          modules: isServer ? 'commonjs' : undefined,
          corejs: 3,
        },
      ],
      '@babel/preset-react',
    ],
    plugins,
  };

  const configWithEnv = {
    ...config,
    env: {
      production: {
        compact: true,
        plugins: ['babel-plugin-jsx-remove-data-test-id'],
      },
    },
  };

  if (!isServer) {
    const serverConfig = getBabelConfig('server');
    const { env, ...serverConfigWithoutEnv } = serverConfig;

    configWithEnv.env.test = serverConfigWithoutEnv;
  }

  return configWithEnv;
};

module.exports = getBabelConfig;
