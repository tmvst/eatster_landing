const glob = require("glob");
const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getNameFromDir = dir => {
  const lastSlash = dir.lastIndexOf("/");
  return dir.slice(lastSlash + 1);
};

const generateHTMLPlugins = () =>
  glob.sync("./src/**/*.html").map(
    dir =>
      new HTMLWebpackPlugin({
        filename: getNameFromDir(dir), // Output
        template: dir // Input
      })
  );

module.exports = {
  node: {
    fs: "empty"
  },
  entry: ["./src/js/main.js", "./src/style/style.scss"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.bundle.js"
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["env"]
        }
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)|\.jpg($|\?)/,
        use: "file-loader"
      },
      {
        test: /\.html$/,
        loader: "raw-loader"
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/images/",
        to: "./images/"
      },
      {
        from: "./src/.well-known",
        to: "./.well-known"
      },
      {
        from: "./src/site.webmanifest",
        to: "./"
      },
      {
        from: "./src/safari-pinned-tab.svg",
        to: "./"
      },
      {
        from: "./src/favicon.ico",
        to: "./"
      },
      {
        from: "./src/favicon-16x16.png",
        to: "./"
      },
      {
        from: "./src/favicon-32x32.png",
        to: "./"
      }
    ]),
    ...generateHTMLPlugins()
  ],
  stats: {
    colors: true
  },
  devtool: "source-map"
};
