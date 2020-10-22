const vm = require("vm")
const { context } = require("./utils")

/** @typedef {{base: String}} Options */

/**
 * Ulka template to html
 *
 * @param {String} template
 * @param {Object} values
 * @param {Options} options
 * @return {String}
 */
function render(template, values, options) {
  return template.replace(/\\?{%(.*?)%}/gs, (...args) => {
    let javascript = args[1]

    // If escaped then return the string without the escape character
    // /{% javascript %} => {% javascript %}
    if (args[0][0] === "\\" && template[args[2] - 1] !== "\\") {
      return args[0].slice(1)
    }

    javascript = javascript.replace(/const |let /gs, "var ")

    // Variables available inside javascript
    values = context(values, options)

    // Run javascript in context
    let result = vm.runInNewContext(javascript, values)

    // If the result is array then join the array by empty string
    if (Array.isArray(result)) {
      result = result.join("")
    }

    return result || ""
  })
}

module.exports = render
