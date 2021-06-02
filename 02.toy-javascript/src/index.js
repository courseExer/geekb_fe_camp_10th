// const { scan } = require("./lexer.js");
// const { demo1 } = require("../__mock__/function.js");

// console.log(scan(demo1.toString()));

const { parser } = require("./syntaxer.js");

console.log(
  parser(`
function abc(x,y){
  let a = 1;
  const b = 2;
  var c = 3;
  return a+b+c;
}
`)
);
