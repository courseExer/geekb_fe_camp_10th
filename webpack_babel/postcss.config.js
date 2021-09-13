const isProduction = process.env.NODE_ENV == "production";

module.exports = {
  // Add you postcss configuration here
  // Learn more about it at https://github.com/webpack-contrib/postcss-loader#config-files
  plugins: [["autoprefixer"]],
};
