const render = require("../src/render")

describe("Render function", () => {
  describe("given a ulka template", () => {
    test("Should replace the variable with value in context", () => {
      expect(render(`{% name %}`, { name: "Roshan Acharya" })).toBe(
        "Roshan Acharya"
      )
    })

    test("Should replace the variable inside html with value in context", () => {
      expect(render("<h1>{% name %}</h1>", { name: "Roshan Acharya" })).toBe(
        "<h1>Roshan Acharya</h1>"
      )
    })

    test("Should skip the escaped the tags", () => {
      expect(render("<h1>\\{% name %}</h1>", { name: "Roshan Acharya" })).toBe(
        "<h1>{% name %}</h1>"
      )
    })

    test("Declared variable should work", () => {
      const template = `
        {% const name = "Roshan Acharya" %}
        {% name %}
      `
      expect(render(template).trim()).toBe("Roshan Acharya")
    })

    test("Should return empty string for undefined", () => {
      expect(render("{% undefined %}")).toBe("")
    })

    test("Should join the array with empty string", () => {
      expect(render(`{% [1, 2, 3, 4, 5, 6] %}`)).toBe("123456")
    })
  })
})
