const { parse } = require("./syntax.js");
const { evaluate } = require("./evaluate.js");
const { myfunction } = require("../mock/function.js");

const result = parse(myfunction.toString());

// console.log(JSON.stringify(result, null, " "));

evaluate(result);
