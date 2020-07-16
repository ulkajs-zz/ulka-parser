const vm = require('vm');
const { replaceString, hasEqualSign } = require('./utils');

function render(ulkaTemplate, values = {}) {
  return ulkaTemplate
    .replace(/\\?{%(.*?)%}/gs, (...args) => {
      let jsCode = args[1];

      if (args[0][0] === '\\') return args[0].slice(1);

      jsCode = jsCode.replace(/(var |let |const )/gs, '');

      const result = vm.runInNewContext(jsCode, values);

      const codeWithoutString = replaceString(jsCode, '');
      const containsEqual = hasEqualSign(codeWithoutString);

      return containsEqual ? '' : result;
    })
    .trim();
}

module.exports = render;
