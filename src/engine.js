const parse = require('./parse');
const fs = require('fs');

const engine = () => {
  return (filePath, options, callback) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parse(content, options);
    return callback(null, parsed);
  };
};

module.exports = engine;
