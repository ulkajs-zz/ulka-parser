const replaceString = (text: string, value = '') =>
  text.replace(/`(.*?)`|"(.*?)"|'(.*?)'/gs, value);

const hasEqualSign = (code: string) =>
  /(?:^|[^=])=(?:$|[^=>])/gs.exec(code) !== null;

async function replaceAsync(str: string, regex: RegExp | string, asyncFn: any) {
  const promises: any[] = [];

  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
    return '';
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

export { replaceString, hasEqualSign, replaceAsync };
