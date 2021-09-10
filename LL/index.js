import { tokenize } from "./lexer.js";
import { Expression } from "./grammer.js";

let source = [];

for (let token of tokenize(`1+2/2`)) {
  if (["WhiteSpace", "LineTerminator"].includes(token.type)) continue;
  source.push(token);
}

console.log(Expression(source));
