let evaluator = {
  Program(node) {
    return evaluate(node.children[0]);
  },
  EOF() {
    return null;
  },
  StatementList(node) {
    let len = node.children.length;
    for (let child of node.children) {
      const result = evaluate(child);
      if (child === node.children[len - 1]) return result;
    }
  },
  Statement(node) {
    return evaluate(node.children[0]);
  },
  VariableDeclaration(node) {
    console.log(node.children);
  },
};

function evaluate(node) {
  if (!evaluator[node.type]) return null;
  return evaluator[node.type](node);
}

module.exports = { evaluate };
