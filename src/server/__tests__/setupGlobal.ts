/* eslint-disable unicorn/prefer-module */
module.exports = () => {
  process.env.TZ = 'UTC';
  delete process.env.IRIS_URL;
  delete process.env.IRIS_FALLBACK_URL;
};
