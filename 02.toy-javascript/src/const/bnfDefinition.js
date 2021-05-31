/**
 * * 来源:ECMA-262《ECMAScript® 2020 language specification》11th edition, June 2020
 * * 地址：https://262.ecma-international.org/11.0/
 * ! 注意点: 通过XRegExp生成的sourceMap中的编号，与实际正则的exec产生的编号有出入，待完善！
 * - 正则文法产生式中要避免递归描述，否则replace无法完成编译工作
 * - 中括号内哪些要加转义符？ 比如**,\,[,]
 * - 中括号外哪些要加转义符？ （待整理）
 * * 定义的语法规范：
 * - value部分支持正则表达式、数组、字符串类型
 *  - 若为正则表达式，按js的正则表达式规范书写，可写占位符
 *  - 若为字符串，无限制，可写占位符
 *  - 若为数组，项类型仅支持正则表达式和字符串，可写占位符
 * - 占位符的格式 /\<[A-Z][a-zA-Z]+\>/
 * ? 问题:
 * - 每个正则分支中，^和?可以加上去吗？比如Identifier就需要这样表述
 * - 如何使用标准组织提供的测试案例，去测试自己写的模块？
 * - LEXICAL中如果value太长了想要换行，但正则表达式如何换行？或者还有别的方法吗？
 * - StringLiteral 和 NumbericLiteral还有问题
 * - 占位符的填充机制还有待完善，比如当前无法完成这样的操作：填充/[^123<A>]/,<A>为/[abc]/
 */

const LEXICAL = {
  /* root */
  InputElement: /<WhiteSpace>|<LineTerminator>|<Comment>|<CommonToken>/u,
  /* branching */
  Comment: /<SingleLineComment>|<MultipleLineComment>/,
  CommonToken: /<Keywords>|<Punctuator>|<IdentifierName>|<Literal>/, // 注意顺序：Keywords要写在IdentifierName之前
  Punctuator: /<OptionalChainingPunctuator>|<OtherPunctuator>/,
  Literal: /<BooleanLiteral>|<NullLiteral>|<StringLiteral>|<NumericLiteral>/,
  OptionalChainingPunctuator: /[\?][.](?!<DecimalDigit>)/,
  StringLiteral:
    // /["]<DoubleStringCharacter>*["]|[']<SingleStringCharacter>*[']/,
    /["][^"\n]*["]|['][^'\n]*[']/,
  DoubleStringCharacter:
    /[^"\\<LineTerminator>]|[\\]<EscapeSequence>|[\\]<LineTerminatorSequence>|<LS>|<PS>/,
  SingleStringCharacter:
    /[^'\\<LineTerminator>]|[\\]<EscapeSequence>|[\\]<LineTerminatorSequence>|<LS>|<PS>/,
  NumericLiteral:
    /<DecimalLiteral>|<DecimalBigIntegerLiteral>|<NonDecimalIntegerLiteral><BigIntLiteralSuffix>/,
  DecimalLiteral:
    /<DecimalIntegerLiteral>[.]<DecimalDigit>*<ExponentPart>*|[.]<DecimalDigit>+<ExponentPart>*|<DecimalIntegerLiteral><ExponentPart>*/,
  DecimalBigIntegerLiteral:
    /0<BigIntLiteralSuffix>|<NonZeroDigit><DecimalDigit>*<BigIntLiteralSuffix>/,
  NonDecimalIntegerLiteral:
    /<BinaryIntegerLiteral>|<OctalIntegerLiteral>|<HexIntegerLiteral>/,
  DecimalIntegerLiteral: /[0]|<NonZeroDigit><DecimalDigit>*/,
  ExponentPart: /<ExponentIndicator><SignedInteger>/,
  BinaryIntegerLiteral: /0b<BinaryDigit>+|0B/,
  OctalIntegerLiteral: /0o<OctalDigit>+|0O<OctalDigit>+/,
  HexIntegerLiteral: /0x<HexDigit>+|0X<HexDigit>+/,
  SignedInteger: /<DecimalDigit>+|[+]<DecimalDigit>+|[-]/,
  EscapeSequence:
    /<CharacterEscapeSequence>|[0](?!<DecimalDigit>)|<HexEscapeSequence>|<UnicodeEscapeSequence>/,
  CharacterEscapeSequence: /<SingleEscapeCharacter>|<NonEscapeCharacter>/,
  NonEscapeCharacter: /[^<EscapeCharacter><LineTerminator>]/,
  EscapeCharacter: /<SingleEscapeCharacter>|<DecimalDigit>|[xu]/,
  HexEscapeSequence: /[x]<HexDigit><HexDigit>/,
  UnicodeEscapeSequence: /u<Hex4Digits>|u{<CodePoint>}/,
  Hex4Digits: /<HexDigit><HexDigit><HexDigit><HexDigit>/,
  SingleLineComment: /\/\/<SingleLineCommentChar>*/,
  SingleLineCommentChar: /[^<LineTerminator>]/,

  /* leaves: 有转义名或缩写名称的 */
  BS: /\u{0008}/, // BACKSPACE, \b
  CR: /\u{000D}/, // CARRIAGE RETURN, \r
  LF: /\u{000A}/, // LINE FEED, \n
  LS: /\u{2028}/, // LINE SEPARATOR
  PS: /\u{2029}/, // PARAGRAPH SEPARATOR
  FF: /\u{000C}/, // FORM FEED,\f
  NBSP: /\u{00A0}/, // NO-BREAK SPACE
  SP: /\u{0020}/, // SPACE
  TAB: /\u{0009}/, // CHARACTER TABULATION,\t
  ZWNBSP: /\u{FEFF}/, // ZERO WIDTH NO-BREAK SPACE
  ZWNJ: /\u{200C}/, // ZERO WIDTH NON-JOINER
  ZWJ: /\u{200D}/, //ZERO WIDTH JOINER
  USP: /[<SP><NBSP>\u{1680}\u{2000}\u{2009}\u{200A}\u{202F}\u{205F}\u{3000}]/, // Unicode Space_Separator
  VT: /\u{000B}/, // LINE TABULATION,\v

  /* leaves:other */
  BigIntLiteralSuffix: /[n]/,
  BinaryDigit: /[01]/,
  BooleanLiteral: /true|false/,
  CodePoint: /[\u{0000}-\u{10FFFF}]/u,
  DecimalDigit: /[0-9]/,
  ExponentIndicator: /[eE]/,
  HexDigit: /[0-9a-fA-F]/,
  IdentifierName: /[a-zA-Z_$]+[0-9a-zA-Z$_]*/, // 精简了标准
  LineTerminator: /<LF>|<CR>|<LS>|<PS>/,
  LineTerminatorSequence: /<LF>|<CR>(?!<LF>)|<LS>|<PS>|<CR><LF>/,
  NotCodePoint: /[^\u{0000}-\u{10FFFF}]/u,
  NullLiteral: /null/,
  NonZeroDigit: /[1-9]/,
  MultipleLineComment: /\/\*(?:[^\*]|[\*](?!\/))*\*\//,
  OctalDigit: /[0-7]/,
  SingleEscapeCharacter: /\'|\"|\\|b|f|n|r|t|v/,
  WhiteSpace: /<TAB>|<VT>|<FF>|<SP>|<NBSP>|<ZWNBSP>|<USP>/,
  Keywords: [
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
  ],
  OtherPunctuator: [
    /[{}()\[\].]/,
    /[.]{3}/,
    /[;,]/,
    /[<>]/,
    /<=/,
    />=/,
    /==/,
    /!=/,
    /===/,
    /!==/,
    /[\+\-\*\/%]/,
    /\/=/,
    /\*\*/,
    /\+\+/,
    /\-\-/,
    /<</,
    />>/,
    />>>/,
    /[,\^!~&\?:=]/,
    /&&/,
    /,,/,
    /\?\?/,
    /\+=/,
    /\-=/,
    /\*=/,
    /\%=/,
    /\*\*=/,
    /<<=/,
    />>=/,
    />>>=/,
    /&=/,
    /\|=/,
    /\^=/,
    /=>/,
  ],
};
const GRAMMER = {};

module.exports = {
  LEXICAL,
  GRAMMER,
};
