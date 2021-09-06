import { tokenize } from "./arithmetic.js";

// 问题：为何要用generator范式来处理本地完整字符串的词法呢？
// 就四则运算这个任务而言，此处source是完整、本地的字符串，完全没有必要这么搞啊？
// 我感觉像异步网络获取的chunk做流式解析的，才适合这种范式吧？
// winter：该范式使得tokenize的处理过程变成了异步 
for (let token of tokenize(`10 + 23 * 45`)) {
  console.log(token);
}
