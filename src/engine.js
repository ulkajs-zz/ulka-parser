const fs = require("fs")
const path = require("path")
const render = require("./render")

const engine = globalOptions => {
  return (filePath, options, callback) => {
    try {
      const content = fs.readFileSync(filePath, "utf-8")
      const html = render(
        content,
        { ...globalOptions, ...options },
        { base: path.dirname(filePath), logError: false }
      )
      return callback(null, html)
    } catch (error) {
      console.log(">> ", error.message)
      throw error
    }
  }
}

module.exports = engine
