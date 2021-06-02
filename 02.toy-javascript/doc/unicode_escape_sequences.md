# _

转义指由于技术等原因无法以字面量方式写出需要字符时的行为。

转义序列指通过有序的字符组合，达到转义效果的解决方案。

某些转义序列只能在字符串中使用：？？
某些则只能在正则表达式字面量中使用：比如 Control escape sequences

一些英文单词

- Unicode Character Name 码点名称
- Code Point 码点
- Escape Sequence 转义序列
- Symbol 符号

References:

- [JavaScript character escape sequences](https://mathiasbynens.be/notes/javascript-escapes)
- [Javascript Escape sequence types](https://riptutorial.com/javascript/example/19374/escape-sequence-types)
- [Some ANSI control sequences (not an exhaustive list)](https://en.wikipedia.org/wiki/ANSI_escape_code)
- [JavaScript’s internal character encoding: UCS-2 or UTF-16?](https://mathiasbynens.be/notes/javascript-encoding)
- [Escape Sequence in JavaScript - A Few Unused Ones as Well](https://dev.to/manikbajaj/character-literals-in-javascript-a-few-unused-ones-as-well-21g9)

## Table 34: String Single Character Escape Sequences

单个字符串转义序列（标准文档）

| Unicode Character Name | Code Point | Escape Sequence | Symbol | 备注                                    |
| :--------------------- | ---------- | --------------- | ------ | --------------------------------------- |
| BACKSPACE              | \u0008     | \b              | \<BS>  | 退格键，正则表达式里的\b 意义是不一样的 |
| CHARACTER TABULATION   | \u0009     | \t              | \<HT>  | 制表符                                  |
| LINE FEED              | \u000A     | \n              | \<LF>  | 换行符                                  |
| LINE TABULATION        | \u000B     | \v              | \<VT>  | 垂直制表符                              |
| FORM FEED              | \u000C     | \f              | \<FF>  | 进纸符                                  |
| CARRIAGE RETURN        | \u000D     | \r              | \<CR>  | 回车符                                  |
| QUOTATION MARK         | \u0022     | \"              | "      | 双引号                                  |
| APOSTROPHE             | \u0027     | \'              | '      | 单引号                                  |
| REVERSE SOLIDUS        | \u005C     | \\              | \      | 转义符                                  |

另外\u0000 可以简写为\0

## Table 64: JSON Single Character Escape Sequences

单个 JSON 字符串转义序列（标准文档）

| Unicode Character Name | Code Point | Escape Sequence | Symbol | 备注   |
| :--------------------- | ---------- | --------------- | ------ | ------ |
| BACKSPACE              | \u0008     | \b              | \<BS>  | 空格   |
| CHARACTER TABULATION   | \u0009     | \t              | \<HT>  | 制表符 |
| LINE FEED              | \u000A     | \n              | \<LF>  | 换行符 |
| FORM FEED              | \u000C     | \f              | \<FF>  | 进纸符 |
| CARRIAGE RETURN        | \u000D     | \r              | \<CR>  | 回车符 |
| QUOTATION MARK         | \u0022     | \"              | "      | 双引号 |
| REVERSE SOLIDUS        | \u005C     | \\              | \      | 单引号 |

## 2-digit Hexadecimal escape sequences

2 位十六进制转义序列

编码值区间介于 0-255（10 进制表述），十六进制表述为 (16\*\*2)，可以使用如下转义序列用法

```ebnf
Symbol::="\x"<Digit><Digit>
Digit::=[0-9A-F]
```

usage:

```js
let reg1 = /[\x00-xff]/; // 匹配连续的字符，在\u0000-\u00ff之间
let reg2 = /[\x00-xFF]/; // 同上，大小写不敏感
```

## 4-digit Unicode escape sequences

4 位 unicode 码点（数值部分）转义序列

编码值区间介于 0-65535（十进制表述），十六进制为 (16\*\*4 -1)，可以使用如下转义序列用法

```ebnf
Symbol::="\u"<Digit><Digit><Digit><Digit> // 短于4位数字的十六进制代码必须用零填充
Digit::=[0-9A-F]
```

usage:

```js
const str = "A \u2192 B"; // A → B
const str = "\u007A"; // z,digit不足4位的，前面补零
```

## Curly bracket Unicode escape sequences

花括号 unicode 码点（数值部分）转义序列

ES6 将 Unicode 支持扩展到从 0 到 0x10FFFF 的整个代码范围。 为了转义代码大于 2\*\*16-1 的字符，引入了转义序列的新语法：

仅在字符串中起作用，而在正则表达式中不起作用?(这句话该怎么理解)

```ebnf
Symbol::="\u" "{" {<Digit>} "}" // 重复数量不限
Digit::=[0-9A-F]
```

usage:

```js
const reg = /[\u{0061}-\u{0065}]/u; // a-e

reg.test("123");
reg.test("123a");
reg.test("123e");
reg.test("123f");
```

## Octal escape sequences

八进制转义序列(已被 ES5 标准淘汰了，了解即可)
严格模式下会报语法错误
但字符串和模版字符串中仍然可以使用\0、\00、\000,因为它们不被视作八进制转义字符

```ebnf
Symbol::="\"{<Digit>}
Digit::=[0-9A-F]
```

## Control escape sequences

具体含义？

场景：仅仅用来作为字母的位置查找场景吗？

usage：

```js
/\cA/.test(String.fromCodePoint(1)) // true,位于字母表的位置
/\cC/.test(String.fromCodePoint(3)) // true
/\cz/.test(String.fromCodePoint(26)) // true
```
