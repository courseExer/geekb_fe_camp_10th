const { parse } = require("./syntax.js");

console.log(
  parse(`let total = 0`)
);

// scan(`
// let total = 0;
// function fnname(arg){
//   var a = 0;
//   let b = 1;
//   let c = 2;
//   return a+b-c;
// }
// for(let i = 0; i<3;i++){
//   total = total + fnname(i);
// }`);
