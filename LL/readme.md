# LL 之构建 AST

## 四则运算

问题：
？为啥要使用 regExp.exec(source)，而不是 source.match(regExp)？

步骤：

- 词法分析：使用正则表达式实现 token 的提取（利用正则的捕获组和 api 的对应关系）
- 词法分析：