/* eslint no-sync: 0 */

process.on('unhandledRejection', e => {
  // eslint-disable-next-line no-console
  console.error(e);
  throw e;
});

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const prettier = require('prettier');
const dtsGenerator = require('dtsGenerator');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve('.prettierrc'))
);

const typesToGenerate = fs.readdirSync(path.resolve('docs', 'types'));

typesToGenerate.forEach(async fileName => {
  const typeContent = yaml.safeLoad(
    fs.readFileSync(path.resolve('docs', 'types', fileName), 'utf8')
  );

  const types = await dtsGenerator.default({
    contents: [typeContent],
    namespaceName: '',
  });

  const filepath = path.resolve(
    'src/types/api',
    fileName.replace('.yaml', '.ts')
  );

  const formatted = prettier.format(
    types
      .replace(/declare (interface|type)/g, 'export $1')
      .replace(/declare namespace/g, 'export declare namespace'),
    {
      ...prettierOptions,
      filepath,
    }
  );

  fs.writeFileSync(filepath, formatted);
});
