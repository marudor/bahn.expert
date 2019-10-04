module.exports = () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        path.node.specifiers = path.node.specifiers.filter(
          s => path.scope.bindings[s.local.name].referenced
        );
        if (!path.node.specifiers.length) {
          path.remove();
        }
      },
    },
  };
};
