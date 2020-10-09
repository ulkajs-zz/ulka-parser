const path = require("path")
const { processArgs, context, customRequire } = require("../src/utils")

const args = ["node", "index", "--data", "roshan", "--data2"]
const cwd = process.cwd()

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

describe("context function", () => {
  test("should have all the expected and provided keys", () => {
    const values = context({ name: "Roshan" }, {})
    expect(Object.keys(values)).toEqual(["name", "require", "console"])
  })

  test("require should have customRequrie in it", () => {
    const value = context({}, { base: cwd }).require("path")
    expect(() => value).not.toThrowError()
  })
})

describe("customRequire function", () => {
  test("should require the node standard module", () => {
    const value = customRequire("path", { base: cwd })
    expect(() => value).not.toThrowError()
  })

  test("should require the local javascript file", () => {
    const value = customRequire("index.js", { base: path.join(cwd, "src") })
    expect(Object.keys(value)).toEqual(["render", "engine"])
  })

  test("should require the local javascript file provided absolute path", () => {
    const value = customRequire("/src/index.js", {})
    expect(Object.keys(value)).toEqual(["render", "engine"])
  })

  test("should read file content", () => {
    const value = customRequire("/LICENSE", {})
    expect(value).toMatchInlineSnapshot(`
      "MIT License

      Copyright (c) 2020 Roshan Acharya

      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the \\"Software\\"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in all
      copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED \\"AS IS\\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      SOFTWARE.
      "
    `)
  })
})
