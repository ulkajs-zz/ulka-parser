const vm = require("vm");

function render(javsacript, values) {
  return vm.runInNewContext(javsacript, values);
}

console.log(render("`<h1>${name}</h1>`", { name: "Roshan Acharya" }));
