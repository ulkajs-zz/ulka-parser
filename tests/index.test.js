describe("Index File", () => {
  test("should export engine and render functions", () => {
    const ulkaParser = require("../src/index")
    expect(Object.keys(ulkaParser)).toEqual(["render", "engine"])
  })
})
