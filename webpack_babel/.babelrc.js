const isProduction = process.env.NODE_ENV == "production";

// https://babeljs.io/docs/en/babel-preset-react
module.exports = {
  plugins: ["@babel/syntax-dynamic-import", "istanbul"],
  presets: [["@babel/preset-env"], ["@babel/preset-react"]],
};
