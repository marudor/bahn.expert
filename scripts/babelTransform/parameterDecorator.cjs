const { extname } = require('node:path');

function isInType(path) {
  switch (path.parent.type) {
    case 'TSTypeReference':
    case 'TSQualifiedName':
    case 'TSExpressionWithTypeArguments':
    case 'TSTypeQuery': {
      return true;
    }

    default: {
      return false;
    }
  }
}

module.exports = function ({ types: t }) {
  function decorateExpression(decorator, paramIndex, key, target) {
    return t.callExpression(decorator.expression, [target, key, paramIndex]);
  }

  function decorateMethod(decorator, paramIndex, methodName, className) {
    const key = t.StringLiteral(methodName);
    const target = t.Identifier(`${className}.prototype`);
    return decorateExpression(decorator, paramIndex, key, target);
  }

  function decorateConstructor(decorator, paramIndex, className) {
    const key = t.Identifier('undefined');
    const target = t.Identifier(className);
    const expression = decorateExpression(decorator, paramIndex, key, target);
    const resultantDecoratorWithFallback = t.logicalExpression(
      '||',
      expression,
      target,
    );
    return t.assignmentExpression('=', target, resultantDecoratorWithFallback);
  }

  function decorateStatic(decorator, paramIndex, methodName, className) {
    const key = t.StringLiteral(methodName);
    const target = t.Identifier(className);
    return decorateExpression(decorator, paramIndex, key, target);
  }

  function decorate(decorator, paramIndex, path, className) {
    const isConstructor = path.node.kind === 'constructor';
    const isStatic = path.node.static;
    const methodName = path.node.key.name;

    if (isStatic) {
      return decorateStatic(decorator, paramIndex, methodName, className);
    }

    if (isConstructor) {
      return decorateConstructor(decorator, paramIndex, className);
    }

    return decorateMethod(decorator, paramIndex, methodName, className);
  }

  return {
    visitor: {
      /**
       * For typescript compilation. Avoid import statement of param decorator functions being Elided.
       */
      Program(path, state) {
        const extension = extname(state.file.opts.filename);

        if (extension === '.ts' || extension === '.tsx') {
          const decorators = Object.create(null);

          for (const clazz of path.node.body
            .filter(
              (it) =>
                it.type === 'ClassDeclaration' ||
                (it.type === 'ExportDefaultDeclaration' &&
                  it.declaration.type === 'ClassDeclaration'),
            )
            .map((it) => {
              return it.type === 'ClassDeclaration' ? it : it.declaration;
            })) {
            for (const body of clazz.body.body) {
              for (const param of body.params || []) {
                for (const decorator of param.decorators || []) {
                  if (decorator.expression.callee) {
                    decorators[decorator.expression.callee.name] = decorator;
                  } else {
                    decorators[decorator.expression.name] = decorator;
                  }
                }
              }
            }
          }

          for (const stmt of path.get('body')) {
            if (stmt.node.type === 'ImportDeclaration') {
              if (stmt.node.specifiers.length === 0) {
                continue;
              }

              for (const specifier of stmt.node.specifiers) {
                const binding = stmt.scope.getBinding(specifier.local.name);

                if (binding.referencePaths.length) {
                  // eslint-disable-next-line unicorn/no-array-reduce
                  const allTypeRefs = binding.referencePaths.reduce(
                    (prev, next) => prev || isInType(next),
                    false,
                  );
                  if (allTypeRefs) {
                    for (const k of Object.keys(decorators)) {
                      const decorator = decorators[k];

                      for (const arg of decorator.expression.arguments || []) {
                        if (arg.name === specifier.local.name) {
                          binding.referencePaths.push({
                            parent: decorator.expression,
                          });
                        }
                      }
                    }
                  }
                } else {
                  if (decorators[specifier.local.name]) {
                    binding.referencePaths.push({
                      parent: decorators[specifier.local.name],
                    });
                  }
                }
              }
            }
          }
        }
      },
      ClassExpression(classPath) {
        const decorators = { _methods_: [], _constructor_: [] };
        const clazz = t.isAssignmentExpression(classPath.parent)
          ? classPath.parent.left
          : classPath.node.id;

        classPath.traverse({
          ClassMethod: function (path) {
            const className = clazz.name;
            const isConstructor = path.node.kind === 'constructor';

            const expressions = (path.node.params || []).flatMap(
              (param, idx) => {
                const paramIndex = t.NumericLiteral(idx);

                const decorated = (param.decorators || []).map((decorator) =>
                  decorate(decorator, paramIndex, path, className),
                );
                param.decorators = [];
                return decorated;
              },
            );

            if (expressions.length > 0) {
              if (isConstructor) {
                decorators._constructor_.push(expressions);
              } else {
                decorators._methods_.push(expressions);
              }
            }
          },
        });

        for (const decoratorsOfMethod of [
          ...decorators._methods_,
          decorators._constructor_,
        ]) {
          for (const expressions of decoratorsOfMethod.reverse()) {
            classPath.parentPath.insertAfter(expressions);
          }
        }
      },
    },
  };
};
