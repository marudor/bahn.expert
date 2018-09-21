module.exports = {
  extends: ['joblift/base', 'joblift/2space', 'joblift/react', 'joblift/flowtype'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {},
  rules: {
    'no-use-before-define': 0,
    'no-shadow': 0,
  },
};
