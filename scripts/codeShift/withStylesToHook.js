// Press ctrl+space for code completion
function transformer(file, api) {
  const j = api.jscodeshift;

  let stop = false;

  j(file.source)
    .find(j.ClassDeclaration, (n) => n.superClass)
    .forEach(() => {
      stop = true;
    });

  if (stop) return;

  let styleUsage = 0;
  let result = j(file.source)
    .find(
      j.VariableDeclaration,
      (n) => n.declarations[0].id.name === 'useStyles',
    )
    .forEach((path) => {
      path.prune();
    })
    .toSource();

  result = j(result)
    .find(j.ImportDefaultSpecifier, (n) => n.local.name === 'styles')
    .forEach((path) => {
      styleUsage += 1;
      path.value.local.name = 'useStyles';
    })
    .toSource();

  function createStylesToMakeStyles(node) {
    return j.callExpression(j.identifier('makeStyles'), [node]);
  }
  result = j(result)
    .find(j.VariableDeclarator, (p) => p.id.name === 'styles')
    .forEach((path) => {
      styleUsage += 1;
      path.value.id.name = 'useStyles';
    })
    .toSource();

  result = j(result)
    .find(j.CallExpression, (n) => n.callee.name === 'createStyles')
    .forEach((path) => {
      styleUsage += 1;
      path.replace(createStylesToMakeStyles(path.value));
    })
    .toSource();

  if (!styleUsage) {
    return;
  }

  result = j(result)
    .find(j.TSIntersectionType)
    .forEach((path) => {
      path.value.types = path.value.types.filter(
        (n) => n.type !== 'TSTypeReference' || n.typeName.name !== 'WithStyles',
      );
    })
    .toSource();

  result = j(result)
    .find(j.TSTypeReference, (n) => n.typeName.name === 'WithStyles')
    .forEach((path) => {
      path.replace(j.tsTypeLiteral([]));
    })
    .toSource();

  result = j(result)
    .find(j.CallExpression, (n) => n.callee.name === 'withStyles')
    .forEach((path) => {
      path.prune();
    })
    .toSource();

  const importToPrune = ['withStyles', 'WithStyles'];

  result = j(result)
    .find(j.ImportSpecifier, (n) => importToPrune.includes(n.imported.name))
    .forEach((path) => {
      path.prune();
    })
    .toSource();

  // let hasImport = false;

  result = j(result)
    .find(j.ImportDeclaration, (n) => n.source.value === '@material-ui/styles')
    .forEach((path) => {
      // hasImport = true;
      if (path.value.specifiers.some((s) => s.imported.name === 'makeStyles')) {
        return;
      }
      path.value.specifiers.push(j.importSpecifier(j.identifier('makeStyles')));
    })
    .toSource();

  result = j(result)
    .find(
      j.ArrowFunctionExpression,
      (n) => n.params.length && n.params[0].type === 'ObjectPattern',
    )
    .forEach((path) => {
      const param = path.value.params[0];

      param.properties = param.properties.filter(
        (p) => p.type !== 'ObjectProperty' || p.value.name !== 'classes',
      );
      const hookCall = j.variableDeclaration('const', [
        j.variableDeclarator(
          j.identifier('classes'),
          j.callExpression(j.identifier('useStyles'), []),
        ),
      ]);

      const body = path.value.body;

      if (body.type === 'BlockStatement') {
        path.value.body.body.unshift(hookCall);
      } else {
        const newBody = j.blockStatement([
          hookCall,
          j.returnStatement(path.value.body),
        ]);

        path.value.body = newBody;
      }
    })
    .toSource();

  return result;
}

module.exports = transformer;
module.exports.parser = 'tsx';
