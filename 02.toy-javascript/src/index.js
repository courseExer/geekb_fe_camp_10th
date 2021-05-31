const { scan } = require("./lexer.js");
const { demo1 } = require("../__mock__/function.js");

console.log(scan(demo1.toString()));
