/* eslint no-sync: 0 */
const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');

const main = yaml.safeLoad(
  fs.readFileSync(path.resolve('docs/main.yaml'), 'utf8')
);
const mainServer = main.servers[0].url;

const additionalFiles = fs
  .readdirSync('docs', 'utf8')
  .filter(file => file !== 'main.yaml' && file.endsWith('.yaml'));

additionalFiles.forEach(docFile => {
  const parsed = yaml.safeLoad(
    fs.readFileSync(path.resolve('docs', docFile), 'utf8')
  );
  const server = parsed.servers[0].url;
  const additionalPath = server.replace(mainServer, '');

  Object.keys(parsed.paths).forEach(pathKey => {
    main.paths[additionalPath + pathKey] = parsed.paths[pathKey];
  });
});

fs.writeFileSync(path.resolve('docs/bundle.json'), JSON.stringify(main));
