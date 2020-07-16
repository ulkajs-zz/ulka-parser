const render = require("../src/render");

describe("render funcion", () => {
  describe("given a ulka template", () => {
    test("returns 'Roshan Acharya' when name is passed as javascript with cotext of {name: 'Roshan Acharya'}", () => {
      expect(render("{% name %}", { name: "Roshan Acharya" })).toBe(
        "Roshan Acharya"
      );
    });

    test("returns '<h1>Roshan Acharya</h1>' when template used called inside html tags with context of {name: 'Roshan Acharya'}", () => {
      expect(render("<h1>{% name %}</h1>", { name: "Roshan Acharya" })).toBe(
        "<h1>Roshan Acharya</h1>"
      );
    });

    test("returns '2,4,6' when [1, 2, 3].map(e => e*2) is called inside ulka tags with no context", () => {
      expect(render("{% [1, 2, 3].map(e => e * 2) %}")).toBe("2,4,6");
    });
  });

  describe("given a string with no javascript", () => {
    test("returns 'a string with no javascript'", () => {
      expect(render("a string with no javascript")).toBe(
        "a string with no javascript"
      );
    });
  });
});
