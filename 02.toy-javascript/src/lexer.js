const XRegExp = require("./tools/XRegExp.js");
const { LEXICAL } = require("./const/bnf_lite.js");

/**
 * 词法扫描
 * @param {String} clip 该语言的代码片段
 * @returns {void 0}
 */
function scan(clip) {
  let result = [];
  const regexp = new XRegExp(LEXICAL, "InputElement", "g");
  regexp.lastIndex = -1;
  while (regexp.lastIndex !== 0) {
    const token = regexp.exec(clip);
    if (token === null) continue;

    let matched = token.shift();
    let types = [];
    token.forEach((item, index) => {
      if (item !== void 0) {
        types.push(regexp.sourceMap.get(index));
      }
    });
    result.push({ matched, types });
  }
  return result;
}

module.exports = { scan };
