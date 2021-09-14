module.exports = {
  extends: "@istanbuljs/nyc-config-babel",
  include: ["src/**/*.js"],
  exclude: ["**/*.spec.js", "**/*.test.js"],
};
