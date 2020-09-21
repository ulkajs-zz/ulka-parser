import vm from 'vm';
import path from 'path';
import fs, { readFileSync } from 'fs';
import { replaceAsync } from './utils';

export type defaultOptionsType = {
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

      if (fs.existsSync(rPath)) reqPath = rPath;

      const { ext } = path.parse(reqPath);

      if (['.js', '.json', '.mjs', '.ts'].includes(ext))
        return require(reqPath);
      else readFileSync(reqPath, 'utf-8');
    },
    ...values,
    console,
  };

  /**
   * {% let sth = "Ulka" %}
   * if /{% sth %}  returns {% sth %} (/ escapes the syntax)
   * if //{% sth %} returns /Ulka (first slash escapes the second slash )
   */
  if (args[0][0] === '\\' && ulkaTemplate[args[2] - 1] !== '\\')
    return args[0].slice(1);

  jsCode = jsCode.replace(/(let |const )/gs, 'var ');

  const result = vm.runInNewContext(jsCode, values);

  let dataToReturn = await result;

  if (Array.isArray(dataToReturn)) dataToReturn = dataToReturn.join('');

  return dataToReturn || '';
};

export default parser;
