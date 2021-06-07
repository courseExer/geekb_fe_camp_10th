const { parse } = require("./syntax.js");

const result = parse(`function myfunction(x,y){
  const a=1;
  const b=a;
  return a+b;
}`);
console.log(JSON.stringify(result, null, " "));