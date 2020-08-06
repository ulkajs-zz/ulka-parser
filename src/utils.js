const replaceString = (text, value = '') =>
  text.replace(/`(.*?)`|"(.*?)"|'(.*?)'/gs, value);

const hasEqualSign = code => /(?:^|[^=])=(?:$|[^=>])/gs.exec(code) !== null;

async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

module.exports = {
  replaceString,
  hasEqualSign,
  replaceAsync,
};
