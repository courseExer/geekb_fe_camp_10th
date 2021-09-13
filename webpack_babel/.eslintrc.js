// https://github.com/yannickcr/eslint-plugin-react#configuration

module.exports = {
  settings: {
    react: {
      createClass: "createReactClass", // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: "React", // Pragma to use, default to "React"
      fragment: "Fragment", // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: "detect", // React version. "detect" automatically picks the version you have installed.
    },
  },
  env: {
    browser: true,
    worker: true,
    node: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "no-unused-vars": [
      "warn",
      {
        vars: "local",
        args: "after-used",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: false,
      },
    ],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  },
};
