const vm = require("vm");

function render(ulkaTemplate, values) {
  return ulkaTemplate.replace(/{%(.*?)%}/gs, (...args) => {
    return vm.runInNewContext(args[1], values);
  });
}

module.exports = render;
