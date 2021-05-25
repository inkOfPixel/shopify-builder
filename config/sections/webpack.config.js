// @ts-check

const path = require("path");
const fs = require("fs");
const LiquidPlugin = require("./plugins/LiquidPlugin");
const AfterEmitPlugin = require("./plugins/AfterEmitPlugin");
const webpack = require("webpack");

const RUNNER_PROJECT_ROOT = process.cwd();
const SECTIONS_ROOT = path.resolve(RUNNER_PROJECT_ROOT, "src/sections");
const BUILER_ROOT = path.resolve(__dirname, "..");
const SRC_ROOT = path.resolve(RUNNER_PROJECT_ROOT, "src");
const RUNNER_NODE_MODULES = path.resolve(RUNNER_PROJECT_ROOT, "node_modules");

function getSections() {
  if (!fs.existsSync(path.resolve(RUNNER_PROJECT_ROOT, "src/sections"))) {
    return {};
  }
  const sections = fs
    .readdirSync(path.resolve(RUNNER_PROJECT_ROOT, "src/sections"))
    .filter((name) => name !== ".DS_Store");

  return sections.reduce(
    (entries, section) => ({
      ...entries,
      [section]: path.resolve(
        RUNNER_PROJECT_ROOT,
        `src/sections/${section}/index.liquid`
      ),
    }),
    {}
  );
}

const config = {
  entry: getSections(),
  output: {
    path: path.resolve(RUNNER_PROJECT_ROOT, "sections"),
    filename: "[name].iop.js",
  },
  watchOptions: {
    aggregateTimeout: 2000,
    ignored: [
      path.posix.resolve(RUNNER_PROJECT_ROOT, "node_modules"),
      path.posix.resolve(RUNNER_PROJECT_ROOT, "assets"),
      path.posix.resolve(RUNNER_PROJECT_ROOT, "sections"),
      path.posix.resolve(RUNNER_PROJECT_ROOT, "snippet"),
      path.posix.resolve(RUNNER_PROJECT_ROOT, "templates"),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [RUNNER_NODE_MODULES, /node_modules/],
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              configFile: `${RUNNER_PROJECT_ROOT}/tsconfig.json`,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: [RUNNER_NODE_MODULES, /node_modules/],
        use: ["babel-loader"],
      },
      {
        test: /\.s?css$/,
        use: [
          "raw-loader",
          "extract-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
          {
            loader: "sass-loader",
          },
          {
            loader: "style-resources-loader",
            options: {
              patterns: [
                `${path.resolve(SRC_ROOT, "lib/variables.scss")}`,
                `${path.resolve(SRC_ROOT, "lib/mixins.scss")}`,
              ],
            },
          },
        ],
      },
      {
        test: /\.json$/,
        exclude: [RUNNER_NODE_MODULES, /node_modules/],
        use: ["raw-loader", { loader: "extract-loader" }],
      },
      {
        test: /\.liquid$/,
        use: [{ loader: "liquid-loader" }],
      },
    ],
  },
  plugins: [new LiquidPlugin(), new AfterEmitPlugin()],
  resolve: {
    modules: [path.join(RUNNER_PROJECT_ROOT, "node_modules")],
    extensions: [".ts", ".js", ".liquid", ".scss"],
    alias: {
      lib: path.resolve(SRC_ROOT, "lib"),
    },
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, "loaders"), "node_modules"],
    extensions: [".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"],
  },
};

module.exports = config;
