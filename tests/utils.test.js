const { processArgs } = require("../src/utils")

const args = ["node", "index", "--data", "roshan", "--data2"]

describe("processArgs function", () => {
  test("should return the value of the given option", () => {
    const value = processArgs("--data", args)
    expect(value).toBe("roshan")
  })

  test("should return true if only provided on args", () => {
    const value = processArgs("--data2", args)
    expect(value).toBe(true)
  })

  test("should return false if option isn't in args", () => {
    const value = processArgs("--random", args)
    expect(value).toBe(false)
  })
})
