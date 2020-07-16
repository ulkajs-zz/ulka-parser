const { replaceString, hasEqualSign } = require('../src/utils');

describe('utils - replaceStringFunction', () => {
  test('returns empty string on given string only', () => {
    expect(replaceString(`'Javascript'`, '')).toBe('');
  });

  test(`returns " is love" when given "'Javascript' is love"`, () => {
    expect(replaceString(`'Javascript' is love`, '')).toBe(' is love');
  });

  test(`Javascript replaced by Typescript`, () => {
    expect(replaceString(`'Javascript' is love`, 'Typescript')).toBe(
      'Typescript is love',
    );
  });

  test('returns empty string when no second arguement is passed', () => {
    expect(replaceString(`'I am Roshan'`)).toBe('');
  });

  test('check all type of strings', () => {
    expect(replaceString(`"Javascript" 'Typescript' \`NodeJs\``, '')).toBe(
      '  ',
    );
  });
});

describe('utils - hasEqualSign', () => {
  test('returns true on statement with equal sign', () => {
    expect(hasEqualSign("const name = 'Roshan'")).toBe(true);
  });

  test('returns false on statement with no equal sign', () => {
    expect(hasEqualSign('5 + 2')).toBe(false);
  });

  test('returns false on two or more equals', () => {
    expect(hasEqualSign('==')).toBe(false);
  });

  test('returns false on arrow syntax', () => {
    expect(hasEqualSign('=>')).toBe(false);
  });
});
