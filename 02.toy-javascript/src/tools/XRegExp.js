const { typeis } = require("./utils.js");
/**
 * 编译产生式
 */
class XRegExp {
  // @param {Object} bnfTable 产生式大表
  // @param {String} propName 产生式节点名称
  // @param {String} flag 正则表达式的装饰符
  constructor(bnfTable, propName, flag) {
    this.sourceMap = new Map();
    this.regexp = new RegExp(this._compile(bnfTable, propName), flag);
  }
  // 同RegExp.exec
  exec(str) {
    return this.regexp.exec(str);
  }
  get lastIndex() {
    return this.regexp.lastIndex;
  }
  set lastIndex(v) {
    return (this.regexp.lastIndex = v);
  }
  // @param {Object} bnfTable
  // @param {String} propName
  // @return {String}
  _compile(bnfTable, propName) {
    // 检查参数
    if (typeis(bnfTable) !== "object") throw new Error("参数错误");
    if (!propName) throw new Error("参数错误");

    // 检查类型
    let propValue = bnfTable[propName],
      propType = typeis(propValue);
    const allowPropTypes = ["regexp"];
    if (!allowPropTypes.includes(propType))
      throw new Error("类型错误，只允许为：", allowPropTypes);

    // 消除占位符
    try {
      propValue = propValue.source.replace(/\<[A-Z][a-zA-Z]+\>/g, (matched) => {
        let placeholderName = matched.slice(1, -1);
        // 创建映射表
        this.sourceMap.set(this.sourceMap.size, placeholderName);
        return `(${this._compile(bnfTable, placeholderName)})`;
      });
    } catch (e) {
      console.log(`:::错误消息:::\n ${e.message}`);
    }

    return propValue;
  }
}

module.exports = XRegExp;
