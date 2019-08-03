module.exports = {
  extends: ['../.eslintrc.js', 'plugin:cypress/recommended'],
  env: {
    'cypress/globals': true,
  },
  plugins: ['cypress'],
};
