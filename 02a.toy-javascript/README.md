# toy-js

## 语法树（AST）的数据结构

```js
const TreeNode = {
  type: String, // 必选
  children: TreeNode|LeafNode[], // 必选
};
const LeafNode = {
  type: String, // 必选，Literal、Identifier填写词性，Keywords、Punctuator填写匹配值
  name: String, // 可选，类型为Identifier时填写匹配值
  value: String, // 可选，类型为Literal时填写匹配值
};
```

## 语法分析的实现

