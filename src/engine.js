const path = require('path');
const fs = require('fs');
const parse = require('./parse');

const engine = ({ globalOptions }) => {
  return (filePath, options, callback) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parse(
      content,
      { ...globalOptions, ...options },
      { base: path.dirname(filePath) },
    );
    return callback(null, parsed);
  };
};

module.exports = engine;
