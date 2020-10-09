const fs = require("fs")
const path = require("path")

const render = require("../src/render")
const { processArgs } = require("../src/utils")

const cwd = process.cwd()
const args = process.argv

// Arguments value provided by user
let argsInputValue = processArgs("--input", args) || processArgs("-I", args)
let argsOutputValue = processArgs("--output", args) || processArgs("-O", args)

// If input path not provided then default the path to /
if (typeof argsInputValue !== "string") {
  argsInputValue = "/"
}

// If output path not provided then default the path to input
if (typeof argsOutputValue !== "string") {
  argsOutputValue = argsInputValue
}

// Full path of the given input and output path
const templatePath = path.join(cwd, argsInputValue)
const outputPath = path.join(cwd, argsOutputValue)

if (!fs.existsSync(templatePath)) {
  throw new Error(">> Error: The provided input path is not valid")
}

if (fs.statSync(templatePath).isDirectory()) {
  const files = findAllUlkaFiles(templatePath)

  files.forEach(file => {
    // Path to the file from tempaltesPath
    const relPath = path.relative(templatePath, file)

    // Path to the output file
    let newOutputPath = path.join(outputPath, relPath)

    // Change extension to .html
    newOutputPath = changeExtensionToHtml(newOutputPath)

    const parsedNewOutputPath = path.parse(newOutputPath)

    // Create output path directories
    fs.mkdirSync(parsedNewOutputPath.dir, { recursive: true })

    // Generate html file
    generateHtml(file, newOutputPath)

    console.log(">> Generated " + newOutputPath)
  })
} else {
  fs.mkdirSync(path.parse(outputPath).dir)

  const newOutputPath = path.join(
    path.parse(outputPath).dir,
    path.parse(templatePath).name + ".html"
  )

  generateHtml(templatePath, newOutputPath)
  console.log(">> Generated " + newOutputPath)
}

/**
 * Find all the files inside direpath with extsion .ulka
 * @param {String} dirPath
 * @param {String[]} [arrayOfFiles]
 * @return {String[]}
 */
function findAllUlkaFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    const pathTo = path.join(dirPath, file)
    if (fs.statSync(pathTo).isDirectory()) {
      arrayOfFiles = findAllUlkaFiles(pathTo, ".ulka", arrayOfFiles)
    } else {
      if (!".ulka" || file.endsWith(".ulka")) arrayOfFiles.push(pathTo)
    }
  })

  return arrayOfFiles
}

/**
 * Change the extension of the given file to html
 * @param {String} filePath
 * @return {String}
 */
function changeExtensionToHtml(filePath) {
  const parsedPath = path.parse(filePath)
  return path.join(parsedPath.dir, parsedPath.name, ".html")
}

/**
 * Generate html from given templates path to the given output path
 *
 * @param {String} tPath Template Path
 * @param {String} oPath Output Path
 */
function generateHtml(tPath, oPath) {
  const template = fs.readFileSync(tPath, "utf-8")
  const html = render(template)
  fs.writeFileSync(oPath, html)
}
