/* eslint-disable no-sync */
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

const filePath = path.resolve(__dirname, '../public/swagger.json');

const content = fs.readFileSync(filePath, 'utf8');

fs.writeFileSync(filePath, content.replace(/%24/g, '$'));
