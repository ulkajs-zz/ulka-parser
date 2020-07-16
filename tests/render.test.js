const render = require('../src/render');

describe('render funcion', () => {
  describe('given a ulka template', () => {
    test("returns 'Roshan Acharya' when name is passed as javascript with cotext of {name: 'Roshan Acharya'}", () => {
      expect(render('{% name %}', { name: 'Roshan Acharya' })).toBe(
        'Roshan Acharya',
      );
    });

    test("returns '<h1>Roshan Acharya</h1>' when template used called inside html tags with context of {name: 'Roshan Acharya'}", () => {
      expect(render('<h1>{% name %}</h1>', { name: 'Roshan Acharya' })).toBe(
        '<h1>Roshan Acharya</h1>',
      );
    });

    test('throws error when undeclared variable is used inside ulka tags', () => {
      expect(() => {
        render('{% undeclaredVariable %}');
      }).toThrow('undeclaredVariable is not defined');
    });

    test("returns '2,4,6' when [1, 2, 3].map(e => e*2) is called inside ulka tags with no context", () => {
      expect(render('{% [1, 2, 3].map(e => e * 2) %}')).toBe('2,4,6');
    });
  });

  describe('given a string with no javascript', () => {
    test("returns 'a string with no javascript'", () => {
      expect(render('a string with no javascript')).toBe(
        'a string with no javascript',
      );
    });
  });

  describe('given nothing', () => {
    test('throws a type error', () => {
      expect(render).toThrow(TypeError);
    });
  });

  describe('given assignment of variable', () => {
    test('returns empty string on assignment only', () => {
      expect(render("{% const name = 'Roshan Acharya' %}")).toBe('');
    });

    test('returns a value assigned', () => {
      const template = `
        {% const name = "Roshan Acharya" %}
        {% name %}
      `;
      expect(render(template)).toBe('Roshan Acharya');
    });
  });

  describe('given escaped tags', () => {
    test('returns ulka tags', () => {
      const template = `
    {%const name = "Roshan Acharya"%}
    \\{% name %}
  `;
      expect(render(template)).toBe('{% name %}');
    });

    test('returns value with \\ should escape the escape', () => {
      expect(render('\\\\{% name %}', { name: 'Roshan Acharya' })).toBe(
        '\\Roshan Acharya',
      );
    });
  });
});
