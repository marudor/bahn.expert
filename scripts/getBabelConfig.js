const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

const getBabelConfig = (type) => {
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
          classnames: 'clsx',
        },
      }
    : undefined;

  const plugins = [
    // [
    //   'babel-plugin-styled-components',
    //   {
    //     displayName: process.env.NODE_ENV !== 'production',
    //     minify: true,
    //     transpileTemplateLiterals: true,
    //     pure: true,
    //   },
    // ],
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
    'lodash',
    [
      'module-resolver',
      {
        // root: 'src',
        ...serverModuleResolver,
      },
    ],
    '@babel/plugin-transform-react-constant-elements',
    'macros',
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
      [
        '@babel/preset-react',
        {
          pragma: 'M',
          pragmaFrag: 'MF',
        },
      ],
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
