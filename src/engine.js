const path = require('path');
const fs = require('fs');
const parse = require('./parse');

const engine = globalOptions => {
  return async (filePath, options, callback) => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = await parse(
        content,
        { ...globalOptions, ...options },
        { base: path.dirname(filePath) },
      );
      return callback(null, parsed);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };
};

module.exports = engine;
