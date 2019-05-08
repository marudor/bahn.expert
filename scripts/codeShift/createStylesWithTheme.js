function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.CallExpression)
    .forEach(path => {
      if (path.value.callee.name === 'createStyles') {
        const styles = path.value.arguments[0];

        if (styles.type !== 'ObjectExpression') {
          return;
        }

        const newStyles = j.arrowFunctionExpression(
          [j.identifier('theme')],
          styles
        );

        path.value.arguments[0] = newStyles;
      }
    })
    .toSource();
}

module.exports = transformer;
module.exports.parser = 'tsx';
