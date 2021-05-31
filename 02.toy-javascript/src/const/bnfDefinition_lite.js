/**
 * 词法定义
 * 产生式都写成正则表达式为宜
 *  - 不能写位置符和修饰符
 *  - 书写优先关系时必须使用非捕获组"(?:)",捕获组特性给编译工具使用了
 *  - 避免写成递归形式
 * ! 完整版的bnfDefinition有些问题，所以暂时当前简单版的
 */

const LEXICAL = {
  /* root */
  InputElement: /<WhiteSpace>|<LineTerminator>|<Comment>|<CommonToken>/u,
  /* branching */
  WhiteSpace: / /,
  LineTerminator: /\n/,
  Comment: /<SingleLineComment>|<MultipleLineComment>/,
  SingleLineComment: /\/\/[^\n]/,
  MultipleLineComment: /\/\*(?:[^\*]|[\*][^\/])*\*\//,
  CommonToken: /<Keywords>|<Punctuator>|<IdentifierName>|<Literal>/, // 注意顺序：Keywords要写在IdentifierName之前
  Punctuator: /<OptionalChainingPunctuator>|<OtherPunctuator>/,
  OtherPunctuator: new RegExp(
    [
      /[\+\-\*\/\%\=]|\+\+|\-\-|\*\*/.source,
      /[\(\)\{\}\[\]\<\>]/.source,
      /[\,\;\^\!\~\&\?\:]/.source,
      /\+\=|\-\=|\*\=|\%\=|\&\=|\=\=|\=\=\=|\!\=|\!\=\=|\>\=|\<\=/.source,
      /\=\>|\>\>|\<\<|\>\>\>|\&\&|\?\?/.source,
      /\.{3}|\./.source, // 有顺序要求
    ].join("|")
  ),
  OptionalChainingPunctuator: /\?\.(?!<DecimalDigit>)/,
  DecimalDigit: /[0-9]/,
  Literal: /<BooleanLiteral>|<NullLiteral>|<StringLiteral>|<NumericLiteral>/,
  BooleanLiteral: /true|false/,
  NullLiteral: /null/,
  StringLiteral: /["][^"\n]*["]|['][^'\n]*[']/,
  NumericLiteral: /(?:[1-9][0-9]*|0)(?:\.[0-9]*)?/,
  IdentifierName: /[a-zA-Z_$]+[0-9a-zA-Z$_]*/,
  Keywords: new RegExp(
    [
      "await",
      "break",
      "case",
      "catch",
      "class",
      "const",
      "continue",
      "debugger",
      "default",
      "delete",
      "do",
      "else",
      "enum",
      "export",
      "extends",
      "false",
      "finally",
      "for",
      "function",
      "if",
      "import",
      "in",
      "instance",
      "of",
      "new",
      "null",
      "return",
      "super",
      "switch",
      "this",
      "throw",
      "true",
      "try",
      "typeof",
      "var",
      "void",
      "while",
      "with",
      "yield",
    ].join("|")
  ),
};

/**
 * * 语法定义
 * 采用JSON数据结构来描述bnf
 * 复数的描述方式，Statement+ ---> StatementList
 */
const SYNTAX = {
  program: [["StatementList", "EOF"]],
  StatementList: [["Statement"], ["StatementList", "Statement"]],
  Statement: [
    "ExpressionStatement",
    "IfStatement",
    "VariableDeclaration",
    "FunctionDeclaration",
  ],
  // expression
  ExpressionStatement: [["Expression", ";"]],
  Expression: [["AdditiveExpression"]],
  AdditiveExpression: [
    ["MultiplicativeExpression"],
    ["AdditiveExpression", "+", "MultiplicativeExpression"],
    ["AdditiveExpression", "-", "MultiplicativeExpression"],
  ],
  MultiplicativeExpression: [
    ["PrimaryExpression"],
    ["MultiplicativeExpression", "*", "PrimaryExpression"],
    ["MultiplicativeExpression", "/", "PrimaryExpression"],
  ],
  PrimaryExpression: [["(", "Expression", ")"], ["Literal"], ["Identifier"]],
  Literal: [["Number"]],
  // If
  IfStatement: [["If", "(", "Expression", ")", "Statement"]],
  // VariableDeclaration
  VariableDeclaration: [["var", "Identifier"]],
  FunctionDeclaration: [
    ["function", "Identifier", "(", ")", "{", "StatementList", "}"],
  ],
};

module.exports = {
  LEXICAL,
  SYNTAX,
};
