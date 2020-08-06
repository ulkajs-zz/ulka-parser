const vm = require('vm');
const path = require('path');
const fs = require('fs');
const { replaceString, hasEqualSign } = require('./utils');

const defaultOptions = {
  base: '',
};

function parser(ulkaTemplate, values = {}, options = defaultOptions) {
  try {
    return ulkaTemplate
      .replace(/\\?{%(.*?)%}/gs, (...args) => {
        let jsCode = args[1];

        values = {
          ...values,
          require: reqPath => {
            const rPath = path.join(options.base, reqPath);
            if (fs.existsSync(rPath)) return require(rPath);
            return require(reqPath);
          },
          console,
        };

        /*
        If first index is equal sign then remove the equal sign
      */
        const containsEqualsInFirstIndex = jsCode[0] === '=';
        if (containsEqualsInFirstIndex) jsCode = jsCode.substr(1);

        /*
        - {% sth = "roshan" %}
        - \{% sth %} => {% sth %}
        - \\{% sth %} => \{% "roshan" %}
       */
        if (args[0][0] === '\\' && ulkaTemplate[args[2] - 1] !== '\\')
          return args[0].slice(1);

        jsCode = jsCode.replace(/(var |let |const )/gs, '');

        const result = vm.runInNewContext(jsCode, values);

        const codeWithoutString = replaceString(jsCode, '');
        const containsEqual = hasEqualSign(codeWithoutString);
        const shouldPrintResult = !containsEqual || containsEqualsInFirstIndex;

        return !shouldPrintResult ? '' : result || '';
      })
      .trim();
  } catch (e) {
    console.log(`Ulka Praser Error: `, e.message);
    throw e;
  }
}

module.exports = parser;
