const { SYNTAX } = require("./const/bnfDefinition_lite.js");
const { closure, start } = require("./tools/SyntaxParser.js");

closure(start, SYNTAX);
