const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  throw new Error('What should I convert?!');
}

const rawJson = fs.readFileSync(path.resolve(filePath), 'utf8');
const parsedJson = JSON.parse(rawJson);

function convertEpochToIso(o) {
  if (!o) return;
  if (Array.isArray(o)) {
    o.forEach(convertEpochToIso);
  } else if (o.constructor === Object) {
    for (const [key, value] of Object.entries(o)) {
      convertEpochToIso(value);
      if (typeof value === 'number' && value > 1500000000000) {
        o[key] = new Date(value);
      }
    }
  }
}
convertEpochToIso(parsedJson);

fs.writeFileSync(path.resolve(filePath), JSON.stringify(parsedJson, null, 2));
