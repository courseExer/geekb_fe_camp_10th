const { scan } = require("./lexer.js");

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
  ],
  // expression
  ExpressionStatement: [["Expression", ";"]],
  Expression: [["AdditiveExpression"]],
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
    ["NumbericLiteral"],
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
    ["let", "Identifier", ";"],
    ["const", "Identifier", ";"],
  ],
  FunctionDeclaration: [
    ["function", "Identifier", "(", ")", "{", "StatementList", "}"],
  ],
  BreakStatement: [["break", ";"]],
  ContinueStatement: [["continue", ";"]],
  Block: [
    ["{", "StatementList", "}"],
    ["{", "}"],
  ],
  WhileStatement: [["while", "(", "Expression", ")", "Statement"]],
};

let hash = {};

function closure(state) {
  // 缓存
  const stateStr = JSON.stringify(state);
  if (!hash[stateStr]) hash[stateStr] = state;

  let queue = [];
  for (let symbol in state) {
    if (symbol.match(/^\$/)) continue;
    queue.push(symbol);
  }
  while (queue.length) {
    let symbol = queue.shift();
    if (!syntax[symbol]) continue;
    for (let rule of syntax[symbol]) {
      if (!state[rule[0]]) queue.push(rule[0]);
      let current = state;
      for (let part of rule) {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
      current.$reduceType = symbol;
      current.$reduceLength = rule.length;
    }
  }
  for (let symbol in state) {
    if (symbol.match(/^\$/)) continue;
    const stateSymbolStr = JSON.stringify(state[symbol]);
    if (hash[stateSymbolStr]) {
      state[symbol] = hash[stateSymbolStr];
    } else {
      closure(state[symbol]);
    }
  }
}

let end = {
  $isEnd: true,
};
let start = {
  Program: end,
};

closure(start);

function parse(source) {
  let stack = [start];
  let symbolStack = [];
  console.log("source:", source);
  // 规约
  function reduce() {
    let state = stack[stack.length - 1];
    if (!state.$reduceType) {
      throw new Error("unexpected token:" + JSON.stringify(state));
    }
    let children = [];
    for (let i = 0; i < state.$reduceLength; i++) {
      stack.pop();
      children.push(symbolStack.pop());
    }
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
  // 输入
  for (let symbol of scan(source)) {
    shift(symbol);
  }
  return reduce();
}

module.exports = {
  parse,
};
