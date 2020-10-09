const path = require("path")
const fs = require("fs")

/** @typedef {{base: String}} Options */

/**
 * Custom require to use inside ulka template
 * @param {String} requirePath
 * @param {Options} options
 * @return {any}
 */
function customRequire(requirePath, options) {
  options.base = path.isAbsolute(requirePath) ? process.cwd() : options.base

  const rPath = path.join(options.base, requirePath)

  if (fs.existsSync(rPath)) requirePath = rPath

  const { ext } = path.parse(requirePath)

  if ([".js", ".mjs", ".json"].includes(ext)) {
    return require(requirePath)
  } else {
    return fs.readFileSync(requirePath, "utf-8")
  }
}

/**
 * Context to provide inside vm
 *
 * @param {Object} values
 * @param {Object} options
 * @return {Object} context
 */
function context(values, options) {
  return {
    ...values,
    require: requirePath => customRequire(requirePath, options),
    console
  }
}

/**
 * Process args value and return value of given option
 *
 * @param {String} option
 * @param {String[]} args
 * @return {String|Boolean}
 */
function processArgs(option, args) {
  const indexOfOption = args.indexOf(option)

  // If options doesn't exist on args then return false
  if (indexOfOption === -1) {
    return false
  }

  // If option's index + 1 exists then return that value
  // else return true
  if (args[indexOfOption + 1]) {
    return args[indexOfOption + 1]
  } else {
    return true
  }
}

module.exports = {
  customRequire,
  context,
  processArgs
}
