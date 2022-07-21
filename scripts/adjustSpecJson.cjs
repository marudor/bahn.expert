/* eslint-disable no-sync */
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

const filePath = path.resolve(__dirname, '../public/swagger.json');

const content = fs.readFileSync(filePath, 'utf8');

const replacedDollar = content.replace(/%24/g, '$');

const parsed = JSON.parse(replacedDollar);

const sortedPaths = {};

const sortedEntries = Object.entries(parsed.paths);
sortedEntries.sort((a, b) => {
  const aName = a[1].get ? a[1].get.operationId : a[1].post?.operationId;
  const bName = b[1].get ? b[1].get.operationId : b[1].post?.operationId;
  return aName?.toLowerCase() > bName?.toLowerCase() ? 1 : -1;
});

sortedEntries.forEach(([key, val], i) => {
  sortedPaths[key] = val;
});

parsed.paths = sortedPaths;

fs.writeFileSync(filePath, JSON.stringify(parsed, undefined, 2));
