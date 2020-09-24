import compile from '../src/compile';

describe('parse funcion', () => {
  describe('given a ulka template', () => {
    test("returns 'Roshan Acharya' when name is passed as javascript with cotext of {name: 'Roshan Acharya'}", async () => {
      expect(await compile('{% name %}', { name: 'Roshan Acharya' })).toBe(
        'Roshan Acharya',
      );
    });

    test("returns '<h1>Roshan Acharya</h1>' when template used called inside html tags with context of {name: 'Roshan Acharya'}", async () => {
      expect(
        await compile('<h1>{% name %}</h1>', { name: 'Roshan Acharya' }),
      ).toBe('<h1>Roshan Acharya</h1>');
    });

    test('throws error when undeclared variable is used inside ulka tags', async () => {
      expect(async () => {
        await compile('{% undeclaredVariable %}');
      }).rejects.toThrow('undeclaredVariable is not defined');
    });
    test("returns '2,4,6' when [1, 2, 3].map(e => e*2) is called inside ulka tags with no context", async () => {
      expect(await compile('{% [1, 2, 3].map(e => e * 2) %}')).toBe('246');
    });
  });

  describe('given a string with no javascript', () => {
    test("returns 'a string with no javascript'", async () => {
      expect(await compile('a string with no javascript')).toBe(
        'a string with no javascript',
      );
    });
  });

  describe('given nothing', () => {
    test('throws a type error', async () => {
      // @ts-ignore
      expect(compile()).rejects.toThrow(TypeError);
    });
  });

  describe('given undefined only', () => {
    test('should return empty string', async () => {
      expect(await compile(`{% undefined %}`)).toBe('');
    });
  });

  describe('given assignment of variable', () => {
    test('returns empty string on assignment only', async () => {
      expect(await compile("{% const name = 'Roshan Acharya' %}")).toBe('');
    });

    test('returns a value assigned', async () => {
      const template = `
        {% const name = "Roshan Acharya" %}
        {% name %}
      `;
      const value = await compile(template);
      expect(value!.trim()).toBe('Roshan Acharya');
    });
  });

  describe('given escaped tags', () => {
    test('returns ulka tags', async () => {
      const template = `
    {%const name = "Roshan Acharya"%}
    \\{% name %}
  `;
      expect((await compile(template)).trim()).toBe('{% name %}');
    });

    test('returns value with \\ should escape the escape', async () => {
      expect(
        (await compile('\\\\{% name %}', { name: 'Roshan Acharya' })).trim(),
      ).toBe('\\Roshan Acharya');
    });
  });

  describe('given a require syntax', () => {
    test('should require the file', async () => {
      expect(await compile(`{% (require('/src/index.ts')) %}`)).toBe(
        '[object Object]',
      );
    });

    test('should require the file, basepath provided', async () => {
      expect(
        await compile(
          `{% (require('src/index.ts')) %}`,
          {},
          { base: process.cwd() },
        ),
      ).toBe('[object Object]');
    });

    test('should throw the error', async () => {
      expect(compile(`{% require('unknown_package') %}`, {})).rejects.toThrow(
        "Cannot find module 'unknown_package' from 'src/parse.ts'",
      );
    });
  });

  describe('destructuring support', () => {
    test('should return the expected value', async () => {
      expect(
        await compile(`{%
          const {name, age} = {name: "Roshan", age: 20}
          name
        %}`),
      ).toEqual('Roshan');
    });
  });

  describe('array', () => {
    test('should return string by joining members', async () => {
      expect(await compile(`{% data %}`, { data: [1, 2, 3] })).toBe('123');
    });

    test('should return string for array with async members', async () => {
      const arrayOfdata = [];
      for (let i = 0; i < 5; i++) {
        arrayOfdata.push(new Promise(resolve => resolve('Hello World')));
      }

      expect(await compile(`{% data %}`, { data: arrayOfdata })).toBe(
        'Hello WorldHello WorldHello WorldHello WorldHello World',
      );
    });
  });
});
