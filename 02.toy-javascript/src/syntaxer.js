const { SYNTAX } = require("./const/bnf_lite.js");
const { scan } = require("./lexer.js");

/**
 * ? questions
 * - hash
 * - queue
 * - state
 * - stack
 */
let hash = {};

// 对语法树进行处理，通过构造状态机来实现语法分析
function closure(state) {
  const stateStr = JSON.stringify(state);
  if (!hash[stateStr]) hash[stateStr] = state;
  let queue = [];
  for (let symbol in state) {
    if (symbol.match(/^\$/)) {
      continue;
    }
    queue.push(symbol);
  }
  while (queue.length) {
    let symbol = queue.shift();
    if (SYNTAX[symbol]) {
      for (let rule of SYNTAX[symbol]) {
        if (!state[rule[0]]) {
          queue.push(rule[0]);
        }
        let current = state;
        for (let part of rule) {
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
        current.$reduceType = symbol;
        current.$reduceLength = rule.length;
      }
    }
  }
  for (let symbol in state) {
    if (symbol.match(/^\$/)) {
      continue;
    }
    if (hash[JSON.stringify(state[symbol])]) {
      state[symbol] = hash[JSON.stringify(state[symbol])];
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

// 处理输入
function parser(source) {
  let stack = [start];
  let symbolStack = [];
  function reduce() {
    let state = stack[stack.length - 1];
    if (state.$reduceType) {
      let children = [];
      for (let i; i < state.$reduceLength; i++) {
        stack.pop();
        children.push(symbolStack.pop());
      }
      // create a non-terminal symbol and shift it
      return {
        type: state.$reduceType,
        children: children.reverse(),
      };
    } else {
      throw new Error("unexpected token");
    }
  }
  function shift(symbol) {
    let state = stack[stack.length - 1];
    if (symbol.types in state) {
      stack.push(symbol);
      symbolStack.push(symbol);
    } else {
      shift(reduce());
      shift(symbol);
    }
  }
  for (let symbol of scan(source)) {
    console.log("shift:", symbol);
    shift(symbol);
  }

  return reduce();
}

module.exports = { parser };
