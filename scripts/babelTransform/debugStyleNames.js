module.exports = babel => {
  const { types: t } = babel;

  return {
    visitor: {
      CallExpression(path, state) {
        if (process.env.NODE_ENV === 'production') return;

        const splittedFileName = state.filename.split('/');
        const fileName = splittedFileName[splittedFileName.length - 1];
        let relevant = fileName.split('.')[0];

        if (relevant === 'index') {
          relevant = splittedFileName[splittedFileName.length - 2];
        }

        if (path.node.callee.name === 'makeStyles') {
          const options = path.node.arguments[1] || t.objectExpression([]);

          if (options.properties.find(p => p.key.name === 'name')) {
            return;
          }
          options.properties.push(
            t.ObjectProperty(t.Identifier('name'), t.stringLiteral(relevant))
          );
          path.node.arguments[1] = options;
        }
      },
    },
  };
};
