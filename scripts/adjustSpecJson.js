/* eslint-disable no-sync */
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../docs/swagger.json');

const content = fs.readFileSync(filePath, 'utf8');

fs.writeFileSync(filePath, content.replace(/%24/g, '$'));
