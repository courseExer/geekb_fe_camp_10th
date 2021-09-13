const isProduction = process.env.NODE_ENV == "production";

// https://babeljs.io/docs/en/babel-preset-react
module.exports = {
  plugins: ["@babel/syntax-dynamic-import"],
  presets: [
    [
      "@babel/preset-env",
      {
        modules: isProduction ? "auto" : false,
      },
    ],
    ["@babel/preset-react"],
  ],
};
