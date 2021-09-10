export function Expression(source) {
  if (
    source[0].type === "AdditiveExpression" &&
    source[1] &&
    source[1].type === "EOF"
  ) {
    let node = Node("Expression");
    node.children = [source.shift(), source.shift()];
    source.unshift(node);
    return node;
  }
  AdditiveExpression(source);
  return Expression(source);
}
// 加法
export function AdditiveExpression(source) {
  if (source[0].type === "MultiplicativeExpression") {
    let node = Node("AdditiveExpression");
    node.children = [source[0]];
    source[0] = node;
    return AdditiveExpression(source);
  }
  if (
    source[0].type === "AdditiveExpression" &&
    source[1] &&
    ["+", "-"].includes(source[1].type)
  ) {
    let node = Node("AdditiveExpression");
    node.operator = source[1].type;
    node.children.push(source.shift());
    node.children.push(source.shift());
    MultiplicativeExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }
  if (source[0].type === "AdditiveExpression") {
    return source[0];
  }
  MultiplicativeExpression(source);
  return AdditiveExpression(source);
}
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
