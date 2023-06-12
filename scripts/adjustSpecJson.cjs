/* eslint-disable no-sync */
const fs = require('node:fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('node:path');

const filePath = path.resolve(__dirname, '../public/swagger.json');

const content = fs.readFileSync(filePath, 'utf8');

const replacedDollar = content.replaceAll('%24', '$');

const parsed = JSON.parse(replacedDollar);

const sortedPaths = {};

const sortedEntries = Object.entries(parsed.paths);
sortedEntries.sort((a, b) => {
  const aName = a[1].get ? a[1].get.operationId : a[1].post?.operationId;
  const bName = b[1].get ? b[1].get.operationId : b[1].post?.operationId;
  return aName?.toLowerCase() > bName?.toLowerCase() ? 1 : -1;
});

for (const [i, [key, val]] of sortedEntries.entries()) {
  sortedPaths[key] = val;
}

parsed.paths = sortedPaths;

fs.writeFileSync(filePath, JSON.stringify(parsed, undefined, 2));
