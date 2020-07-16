const replaceString = (text, value) =>
  text.replace(/`(.*?)`|"(.*?)"|'(.*?)'/gs, value);

const hasEqualSign = code => /(?:^|[^=])=(?:$|[^=>])/gs.exec(code) !== null;

module.exports = {
  replaceString,
  hasEqualSign,
};
