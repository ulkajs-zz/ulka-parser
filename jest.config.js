module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/render.js", "src/utils.js", "src/index.js"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}
