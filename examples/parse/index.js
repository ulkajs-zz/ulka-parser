const fs = require('fs');
const path = require('path');
const ulkaParser = require('../../src/index');

const ulkaTemplate = fs.readFileSync(
  path.join(__dirname, 'index.ulka'),
  'utf-8',
);

ulkaParser.parse(ulkaTemplate).then(html => {
  fs.writeFileSync(path.join(__dirname, 'index.html'), html.trim());
});
