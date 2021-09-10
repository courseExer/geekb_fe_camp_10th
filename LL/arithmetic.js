const dictionary = [
  "Number",
  "WhiteSpace",
  "LineTerminator",
  "*",
  "/",
  "+",
  "-",
];
const reg = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g; // 此处的装饰符g+exec，等同与str.match(regExp)

export function* tokenize(source) {
  let result = null;
  let lastIndex = 0;
  while (true) {
    lastIndex = reg.lastIndex;
    result = reg.exec(source);
    if (!result) break;
    if (reg.lastIndex - lastIndex > result[0].length)
      throw new Error(`未知的Token${result[0]}`);
    let token = {
      type: null,
      value: null,
    };
    for (let i = 1; i <= dictionary.length; i++) {
      if (result[i]) {
        token.type = dictionary[i - 1];
      }
    }
    token.value = result[0];
    yield token; // 最佳实践：当我们要返回的值是一个序列时，使用yield
  }
  yield { type: "EOF" };
}

// ================语法分析==================

export function Expression(tokens) {}
export function AdditiveExpression(source) {}
// 乘法
export function MultiplicativeExpression(source) {
  if (source[0].type === "Number") {
    let node = Node("MultiplicativeExpression");
    node.children = [source[0]];
    source[0] = node;
    return MultiplicativeExpression(source);
  }
  if (
    source[0].type === "MultiplicativeExpression" &&
    source[1] &&
    ["*", "/"].includes(source[1].type)
  ) {
    let node = Node("MultiplicativeExpression");
    node.operator = source[1].type;
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());
    source.unshift(node);
    return MultiplicativeExpression(source);
  }
  if (source[0].type === "MultiplicativeExpression") {
    return source[0];
  }
  throw new Error("不应该被执行");
}
function Node(type = null) {
  return { type, operator: null, children: [] };
}
