const vm = require('vm');

function render(ulkaTemplate, values = {}) {
  return ulkaTemplate.replace(/{%(.*?)%}/gs, (...args) => {
    let jsCode = args[1];

    jsCode = jsCode.replace(/(var |let |const )/gs, '');

    return vm.runInNewContext(jsCode, values);
  });
}

module.exports = render;
