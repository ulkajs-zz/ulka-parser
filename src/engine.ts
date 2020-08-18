import path from 'path';
import fs from 'fs';
import parse, { defaultOptionsType } from './parse';

const engine = (globalOptions: any) => {
  return async (
    filePath: string,
    options: defaultOptionsType,
    callback: Function,
  ) => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = await parse(
        content,
        { ...globalOptions, ...options },
        { base: path.dirname(filePath), logError: false },
      );
      return callback(null, parsed);
    } catch (error) {
      console.log('>> ', error.message);
      throw error;
    }
  };
};

export default engine;
