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
        root: 'src',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    '@loadable/babel-plugin',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    './scripts/babelTransform/parameterDecorator.cjs',
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
    assumptions: {
      arrayLikeIsIterable: false,
      constantReexports: true,
      constantSuper: true,
      enumerableModuleMeta: true,
      ignoreFunctionLength: true,
      ignoreToPrimitiveHint: true,
      iterableIsArray: true,
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
          // loose: true,
          useBuiltIns: 'usage',
          modules: isServer ? 'commonjs' : undefined,
          corejs: '3.16',
          exclude: ['proposal-dynamic-import'],
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
        plugins: ['@emotion', 'babel-plugin-jsx-remove-data-test-id'],
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
