const vm = require("vm");

function render(ulkaTemplate, values) {
  return ulkaTemplate.replace(/{%(.*?)%}/gs, (...args) => {
    return vm.runInNewContext(args[1], values);
  });
}

console.log(render("<h1>{% name %}</h1>", { name: "Roshan Acharya" }));
