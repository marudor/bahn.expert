const fs = require('node:fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('node:path');

const getBabelConfig = (type) => {
  const isServer = type === 'server';

  const presetEnvTargets = isServer
    ? {
        targets: {
          node: 'current',
        },
      }
    : undefined;

  const plugins = [
    [
      'babel-plugin-import',
      {
        libraryName: '@mui/material',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'core',
    ],
    [
      'babel-plugin-import',
      {
        libraryName: '@mui/icons-material',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'icons',
    ],
    [
      'babel-plugin-const-enum',
      {
        transform: 'constObject',
      },
    ],
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    '@loadable/babel-plugin',
    ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
    './scripts/babelTransform/parameterDecorator.cjs',
    // 'babel-plugin-parameter-decorator',
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
    assumptions: {
      arrayLikeIsIterable: false,
      constantReexports: true,
      constantSuper: true,
      enumerableModuleMeta: true,
      ignoreFunctionLength: true,
      ignoreToPrimitiveHint: true,
      iterableIsArray: false,
      mutableTemplateObject: true,
      noClassCalls: true,
      noDocumentAll: true,
      noIncompleteNsImportDetection: true,
      noNewArrows: true,
      objectRestNoSymbols: true,
      privateFieldsAsProperties: true,
      pureGetters: true,
      setComputedProperties: true,
      setPublicClassFields: true,
      setSpreadProperties: true,
      skipForOfIteratorClosing: true,
      superIsCallableConstructor: true,
    },
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          ...presetEnvTargets,
          useBuiltIns: 'usage',
          modules: isServer ? 'commonjs' : undefined,
          corejs: '3.24',
          exclude: ['web.dom-collections.iterator'],
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
          importSource: '@emotion/react',
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
        plugins: [
          '@emotion',
          'babel-plugin-jsx-remove-data-test-id',
          'transform-remove-console',
        ],
      },
      development: {
        plugins: ['@emotion'],
      },
      testProduction: {
        plugins: ['@emotion'],
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
