import vm from 'vm';
import path from 'path';
import fs from 'fs';
import { replaceString, hasEqualSign, replaceAsync } from './utils';

type defaultOptionsType = {
  base?: string;
  logError?: boolean;
};

const defaultOptions = {
  base: process.cwd(),
  logError: true,
};

async function parser(
  ulkaTemplate: string,
  values = {},
  options: defaultOptionsType = defaultOptions,
) {
  try {
    return await replaceAsync(
      ulkaTemplate,
      /\\?{%(.*?)%}/gs,
      replaceCallback(ulkaTemplate, values, options),
    );
  } catch (e) {
    options.logError && console.log('>> ', e.message);
    throw e;
  }
}

const replaceCallback = (
  ulkaTemplate: string,
  values: any,
  options: any,
) => async (...args: any[]) => {
  let jsCode = args[1];

  values = {
    require: (reqPath: string) => {
      options.base = path.isAbsolute(reqPath) ? process.cwd() : options.base;
      const rPath = path.join(options.base, reqPath);
      if (fs.existsSync(rPath)) return require(rPath);
      return require(reqPath);
    },
    ...values,
    console,
  };

  // If first index is equal sign then remove  equal or minus sign
  const containsEqualsInFirstIndex = jsCode[0] === '=';
  const containsMinusInFirstIndex = jsCode[0] === '-';

  if (containsEqualsInFirstIndex || containsMinusInFirstIndex)
    jsCode = jsCode.substr(1);

  /*
  - {% sth = "roshan" %}
  - \{% sth %} => {% sth %}
  - \\{% sth %} => \{% "roshan" %}
 */
  if (args[0][0] === '\\' && ulkaTemplate[args[2] - 1] !== '\\')
    return args[0].slice(1);

  jsCode = jsCode.replace(/(var |let |const )/gs, '');

  const result = vm.runInNewContext(jsCode, values);

  const codeWithoutString = replaceString(jsCode, '');
  const containsEqual = hasEqualSign(codeWithoutString);
  const shouldPrintResult =
    (!containsEqual || containsEqualsInFirstIndex) &&
    !containsMinusInFirstIndex;

  let dataToReturn = await result;

  if (Array.isArray(dataToReturn)) dataToReturn = dataToReturn.join('');

  return !shouldPrintResult ? '' : dataToReturn || '';
};

export default parser;
