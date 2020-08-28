import parse from '../src/parse';

describe('parse funcion', () => {
  describe('given a ulka template', () => {
    test("returns 'Roshan Acharya' when name is passed as javascript with cotext of {name: 'Roshan Acharya'}", async () => {
      expect(await parse('{% name %}', { name: 'Roshan Acharya' })).toBe(
        'Roshan Acharya',
      );
    });

    test("returns '<h1>Roshan Acharya</h1>' when template used called inside html tags with context of {name: 'Roshan Acharya'}", async () => {
      expect(
        await parse('<h1>{% name %}</h1>', { name: 'Roshan Acharya' }),
      ).toBe('<h1>Roshan Acharya</h1>');
    });

    test('throws error when undeclared variable is used inside ulka tags', async () => {
      expect(async () => {
        await parse('{% undeclaredVariable %}');
      }).rejects.toThrow('undeclaredVariable is not defined');
    });
    test("returns '2,4,6' when [1, 2, 3].map(e => e*2) is called inside ulka tags with no context", async () => {
      expect(await parse('{% [1, 2, 3].map(e => e * 2) %}')).toBe('246');
    });
  });

  describe('given a string with no javascript', () => {
    test("returns 'a string with no javascript'", async () => {
      expect(await parse('a string with no javascript')).toBe(
        'a string with no javascript',
      );
    });
  });

  describe('given nothing', () => {
    test('throws a type error', async () => {
      // @ts-ignore
      expect(parse()).rejects.toThrow(TypeError);
    });
  });

  describe('given undefined only', () => {
    test('should return empty string', async () => {
      expect(await parse(`{% undefined %}`)).toBe('');
    });
  });

  describe('given assignment of variable', () => {
    test('returns empty string on assignment only', async () => {
      expect(await parse("{% const name = 'Roshan Acharya' %}")).toBe('');
    });

    test('returns a value assigned', async () => {
      const template = `
        {% const name = "Roshan Acharya" %}
        {% name %}
      `;
      expect((await parse(template)).trim()).toBe('Roshan Acharya');
    });
  });

  describe('given escaped tags', () => {
    test('returns ulka tags', async () => {
      const template = `
    {%const name = "Roshan Acharya"%}
    \\{% name %}
  `;
      expect((await parse(template)).trim()).toBe('{% name %}');
    });

    test('returns value with \\ should escape the escape', async () => {
      expect(
        (await parse('\\\\{% name %}', { name: 'Roshan Acharya' })).trim(),
      ).toBe('\\Roshan Acharya');
    });
  });

  describe('given a require syntax', () => {
    test('should require the file', async () => {
      expect(await parse(`{% (require('/src/index.ts')) %}`)).toBe(
        '[object Object]',
      );
    });

    test('should require the file, basepath provided', async () => {
      expect(
        await parse(
          `{% (require('src/index.ts')) %}`,
          {},
          { base: process.cwd() },
        ),
      ).toBe('[object Object]');
    });

    test('should throw the error', async () => {
      expect(parse(`{% require('unknown_package') %}`, {})).rejects.toThrow(
        "Cannot find module 'unknown_package' from 'src/parse.ts'",
      );
    });
  });

  describe('destructuring support', () => {
    test('should return the expected value', async () => {
      expect(
        await parse(`{%
          const {name, age} = {name: "Roshan", age: 20}
          name
        %}`),
      ).toEqual('Roshan');
    });
  });
});
