/* eslint no-sync: 0 */

process.on('unhandledRejection', e => {
  // eslint-disable-next-line no-console
  console.error(e);
  throw e;
});

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const dtsGenerator = require('dtsgenerator');
const { isObject, get, set } = require('lodash');
const babel = require('@babel/core');
const childProcess = require('child_process');

const basePath = path.resolve('docs', 'types');

function walk(obj, fn) {
  if (Array.isArray(obj)) {
    obj.forEach(item => walk(item, fn));
  } else if (isObject(obj)) {
    fn(obj);
    Object.keys(obj).forEach(key => {
      walk(obj[key], fn);
    });
  }
}

function resolveReferences(typeContent) {
  return obj => {
    if (obj.hasOwnProperty('allOf')) {
      obj.anyOf = obj.allOf;
      delete obj.allOf;
      obj.description = 'GEN: allOf';
    }
    if (obj.hasOwnProperty('$ref')) {
      if (obj.$ref.startsWith('#')) return;
      const [fileName, unsplitReferencedPath] = obj.$ref.split('#');
      const referencedPath = unsplitReferencedPath.split('/');
      const referencedFile = yaml.safeLoad(
        fs.readFileSync(path.resolve(basePath, fileName))
      );

      walk(referencedFile, resolveReferences(typeContent));
      const referencedPart = get(referencedFile, referencedPath.slice(1));

      const genDirective = `GEN: import { ${
        referencedPath[referencedPath.length - 1]
      } } from './${fileName.replace('.yaml', '')}'`;

      referencedPart.description = genDirective;
      set(typeContent, referencedPath.slice(1), referencedPart);
      obj.$ref = `#${unsplitReferencedPath}`;
    }
  };
}

async function generateForFile(fileName) {
  const typeContent = yaml.safeLoad(
    fs.readFileSync(path.resolve(basePath, fileName), 'utf8')
  );

  walk(typeContent, resolveReferences(typeContent));
  // eslint-disable-next-line no-await-in-loop
  const types = await dtsGenerator.default({
    contents: [typeContent],
    namespaceName: '',
  });

  const simpleTransformed = types
    .replace(/declare (interface|type)/g, 'export $1')
    .replace(/declare namespace/g, 'export declare namespace');

  const babelTransformed = babel.transformSync(simpleTransformed, {
    plugins: [
      './scripts/babelTransform/modifyDocTypes',
      '@babel/plugin-syntax-typescript',
    ],
    babelrc: false,
  }).code;

  const cleanedTransform = babel.transformSync(babelTransformed, {
    plugins: [
      './scripts/babelTransform/cleanupUnusedImports',
      '@babel/plugin-syntax-typescript',
    ],
    babelrc: false,
  }).code;

  const filepath = path.resolve(
    'src/types/api',
    fileName.replace('.yaml', '.ts')
  );

  fs.writeFileSync(filepath, cleanedTransform);

  childProcess.execSync(`eslint ${filepath} --fix`);
}

async function generate() {
  const typesToGenerate = fs.readdirSync(basePath);

  for (const fileName of typesToGenerate) {
    // eslint-disable-next-line no-await-in-loop
    await generateForFile(fileName);
  }
}

generate();
