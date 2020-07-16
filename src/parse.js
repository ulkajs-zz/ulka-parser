const vm = require('vm');
const { replaceString, hasEqualSign } = require('./utils');

function parser(ulkaTemplate, values = {}) {
  return ulkaTemplate
    .replace(/\\?{%(.*?)%}/gs, (...args) => {
      let jsCode = args[1];

      values = {
        ...values,
        require,
        console,
      };

      if (args[0][0] === '\\' && ulkaTemplate[args[2] - 1] !== '\\')
        return args[0].slice(1);

      jsCode = jsCode.replace(/(var |let |const )/gs, '');

      const result = vm.runInNewContext(jsCode, values);

      const codeWithoutString = replaceString(jsCode, '');
      const containsEqual = hasEqualSign(codeWithoutString);

      return containsEqual ? '' : result || '';
    })
    .trim();
}

module.exports = parser;
