const fs = require('fs');
const path = require('path');
const ulkaParser = require('../../src/index');

const ulkaTemplate = fs.readFileSync(
  path.join(__dirname, 'index.ulka'),
  'utf-8',
);

const parsedHtml = ulkaParser.parse(ulkaTemplate);

fs.writeFileSync(path.join(__dirname, 'index.html'), parsedHtml);
