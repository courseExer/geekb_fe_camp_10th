const { scan } = require("./lexer.js");

// 语法分析器
// 输入的东西叫做terminal symbol

let syntax = {
  Program: [["StatementList", "EOF"]],
  StatementList: [["Statement"], ["StatementList", "Statement"]],
  Statement: [
    ["ExpressionStatement"],
    ["IfStatement"],
    ["WhileStatement"],
    ["VariableDeclaration"],
    ["FunctionDeclaration"],
    ["Block"],
    ["BreakStatement"],
    ["ContinueStatement"],
    ["ReturnStatement"],
  ],
  // expression
  ExpressionStatement: [["Expression", ";"]],
  Expression: [
    ["AdditiveExpression"],
    ["Expression", ">", "Expression"],
    ["Expression", "<", "Expression"],
  ],
  AdditiveExpression: [
    ["MultiplicativeExpression"],
    ["AdditiveExpression", "+", "MultiplicativeExpression"],
    ["AdditiveExpression", "-", "MultiplicativeExpression"],
  ],
  MultiplicativeExpression: [
    ["PrimaryExpression"],
    ["MultiplicativeExpression", "*", "PrimaryExpression"],
    ["MultiplicativeExpression", "/", "PrimaryExpression"],
  ],
  PrimaryExpression: [["(", "Expression", ")"], ["Literal"], ["Identifier"]],
  AssignmentExpression: [
    ["LeftHandSideExpression", "=", "LogicalORExpression"],
    ["LogicalORExpression"],
  ],
  LogicalORExpression: [
    ["LogicalANDExpression"],
    ["LogicalORExpression", "||", "LogicalANDExpression"],
  ],
  LogicalANDExpression: [
    ["AdditiveExpression"],
    ["LogicalANDExpression", "&&", "AdditiveExpression"],
  ],
  LeftHandSideExpression: [["CallExpression"], ["NewExpression"]],
  CallExpression: [
    ["MemberExpression", "Arguments"],
    ["CallExpression", "Arguments"],
  ],
  Arguments: [
    ["(", ")"],
    ["(", "ArgumentList", ")"],
  ],
  ArgumentList: [
    ["AssignmentExpression"],
    ["ArgumentList", ",", "AssignmentExpression"],
  ],
  NewExpression: [["MemberExpression"], ["new", "NewExpression"]],
  MemberExpression: [
    ["PrimaryExpression"],
    ["PrimaryExpression", ".", "Identifier"],
    ["PrimaryExpression", "[", "Expression", "]"],
  ],
  Literal: [
    ["NumericLiteral"],
    ["StringLiteral"],
    ["BooleanLiteral"],
    ["NullLiteral"],
    ["RegularExpressionLiteral"],
    ["ObjectLiteral"],
    ["ArrayLiteral"],
  ],
  ObjectLiteral: [
    ["{", "}"],
    ["{", "PropertyList", "}"],
  ],
  PropertyList: [["Property"], ["PropertyList", ",", "Property"]],
  Property: [
    ["StringLiteral", ":", "AdditiveExpression"],
    ["Identifier", ":", "AdditiveExpression"],
  ],
  // If
  IfStatement: [["If", "(", "Expression", ")", "Statement"]],
  // VariableDeclaration
  VariableDeclaration: [
    ["var", "Identifier", ";"],
    ["var", "Identifier", "=", "Expression", ";"],
    ["let", "Identifier", ";"],
    ["let", "Identifier", "=", "Expression", ";"],
    ["const", "Identifier", ";"],
    ["const", "Identifier", "=", "Expression", ";"],
    ["Identifier", "=", "Expression", ";"],
  ],
  FunctionDeclaration: [["function", "Identifier", "Arguments", "Block"]],
  BreakStatement: [["break", ";"]],
  ContinueStatement: [["continue", ";"]],
  Block: [
    ["{", "StatementList", "}"],
    ["{", "}"],
  ],
  WhileStatement: [["while", "(", "Expression", ")", "Block"]],
  ReturnStatement: [
    ["return", "Expression", ";"],
    ["return", "Literal", ";"],
    ["return", "Identifier", ";"],
    ["return", "';'"],
  ],
};

// 对象状态机
let end = {
  $isEnd: true,
};
let start = {
  Program: end,
};

// 哈希表缓存,防止产生式中递归描述产生死循环
let hash = {}; 

// closure的作用，是对入参进行修改
// 创建一个语法状态机，穷举所有可能的走法（允许有回环，不允许无限步数）
// 当前key表示当前状态，key所处的深度代表已走的步数，value表示下一步可选的状态
function closure(state) {
  // 哈希表保存
  const stateStr = JSON.stringify(state);
  if (!hash[stateStr]) hash[stateStr] = state;

  // ===广度优先搜索的套路===
  // shift和push组成一对Enqueue（入队）和Dequeue（出队）
  // 搜集state中的属性名到queue
  let queue = [];
  for (let symbol in state) {
    if (symbol.match(/^\$/)) continue; // 不接受$开头的属性名
    queue.push(symbol);
  }
  // 按照语法表内容，在state对象上创建完整的（一一对应的）线性数据结构（key是上一个状态，value是下一个状态）
  while (queue.length) {
    let symbol = queue.shift();
    if (!syntax[symbol]) continue;
    for (let rule of syntax[symbol]) {
      if (!state[rule[0]]) queue.push(rule[0]); // queue压入产生式列表的第一项
      // 在state上，创建一个线性数据结构（有名字无内容）
      let current = state;
      for (let part of rule) {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
      // 在该线性结构的末节点，添加以$开头的属性
      current.$reduceType = symbol;
      current.$reduceLength = rule.length;
    }
  }
  // 处理下一个状态，即将创建新的state线性结构
  // 对于bnf中有重复的情况，只需在数据结构中创造回环的结构即可（指针），而不必真的去创建这些内容
  for (let symbol in state) {
    if (symbol.match(/^\$/)) continue; // 不接受$开头的属性名
    const stateSymbolStr = JSON.stringify(state[symbol]);
    // 哈希表查询来避免递归
    if (hash[stateSymbolStr]) {
      state[symbol] = hash[stateSymbolStr];
    } else {
      closure(state[symbol]);
    }
  }
}

closure(start);

function parse(source) {
  let stack = [start];
  let symbolStack = []; // ？？
  console.log("source:", source);
  // 输入token流
  for (let symbol of scan(source)) {
    console.log("symbol:", symbol);
    shift(symbol);
  }
  // 规约
  function reduce() {
    let state = stack[stack.length - 1];
    if (!state.$reduceType) {
      console.log("错误：", state);
      throw new Error("unexpected token:" + JSON.stringify(state));
    }
    let children = [];
    for (let i = 0; i < state.$reduceLength; i++) {
      stack.pop();
      children.push(symbolStack.pop());
    }
    // TreeNode数据结构
    // （而leafNode数据结构已经在lexer.js里做好了）
    return {
      type: state.$reduceType,
      children: children.reverse(),
    };
  }
  // 移进
  function shift(symbol) {
    let state = stack[stack.length - 1];
    if (symbol.type in state) {
      stack.push(state[symbol.type]);
      symbolStack.push(symbol);
    } else {
      shift(reduce());
      shift(symbol);
    }
  }

  // 返回最终的树形数据结构（语法树，AST）
  return reduce();
}

module.exports = {
  parse,
};
