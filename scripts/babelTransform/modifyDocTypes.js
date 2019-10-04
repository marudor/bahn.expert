module.exports = babel => {
  let importsToAdd = [];

  function processComment(path, comment) {
    const splitComment = comment.value.split('\n');
    const newCommentArray = splitComment.filter(c => {
      const normalizedComment = c.substr(3);
      let r = true;

      if (normalizedComment.startsWith('GEN')) {
        r = false;
        if (normalizedComment.endsWith('allOf')) {
          path.node.declaration.typeAnnotation.type = 'TSIntersectionType';
        }
        if (normalizedComment.includes('import {')) {
          path.remove();
          importsToAdd.push(normalizedComment.replace('GEN: ', ''));
        }
      }

      return r;
    });

    comment.value = newCommentArray.join('\n');
  }

  return {
    visitor: {
      Program: {
        enter() {
          importsToAdd = [];
        },
        exit(path) {
          importsToAdd.forEach(i => {
            path.node.body.unshift(babel.template(i)());
          });
        },
      },

      ExportNamedDeclaration(path) {
        const comments = path.node.leadingComments;

        if (comments) {
          comments.forEach(c => processComment(path, c));
        }
      },
    },
  };
};
