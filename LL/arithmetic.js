const dictionary = [
  "Number",
  "WhiteSpace",
  "LineTerminator",
  "*",
  "/",
  "+",
  "-",
];
const reg = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g; // 此处的装饰符g+exec，等同与str.match(regExp)

export function* tokenize(source) {
  let result = null;
  let lastIndex = 0;
  while (true) {
    lastIndex = reg.lastIndex;
    result = reg.exec(source);
    if (!result) break;
    if (reg.lastIndex - lastIndex > result[0].length)
      throw new Error(`未知的Token${result[0]}`);
    let token = {
      type: null,
      value: null,
    };
    for (let i = 1; i <= dictionary.length; i++) {
      if (result[i]) {
        token.type = dictionary[i - 1];
      }
    }
    token.value = result[0];
    yield token; // 最佳实践：当我们要返回的值是一个序列时，使用yield
  }
  yield { type: "EOF" };
}