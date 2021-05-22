// @ts-check

const path = require("path");
const fs = require("fs");
const LiquidPlugin = require("./plugins/LiquidPlugin");
const AfterEmitPlugin = require("./plugins/AfterEmitPlugin");

const PROJECT_ROOT = path.resolve(process.cwd());
const BUILER_ROOT = path.resolve(__dirname, "..");
const SRC_ROOT = path.resolve(PROJECT_ROOT, "src");
const NODE_MODULES = path.resolve(PROJECT_ROOT, "node_modules");

function getSections() {
  if (!fs.existsSync(path.resolve(PROJECT_ROOT, "src/sections"))) {
    return {};
  }
  const sections = fs
    .readdirSync(path.resolve(PROJECT_ROOT, "src/sections"))
    .filter((name) => name !== ".DS_Store");

  return sections.reduce(
    (entries, section) => ({
      ...entries,
      [section]: path.resolve(
        PROJECT_ROOT,
        `src/sections/${section}/index.liquid`
      ),
    }),
    {}
  );
}

const config = {
  entry: getSections(),
  output: {
    path: path.resolve(PROJECT_ROOT, "sections"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [NODE_MODULES, /node_modules/],
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              configFile: `${BUILER_ROOT}/builder.tsconfig.json`,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: [NODE_MODULES, /node_modules/],
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
            loader: require.resolve("postcss-loader"),
            options: {
              postcssOptions: {
                config: path.resolve(BUILER_ROOT, "postcss.config.js"),
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
        exclude: [NODE_MODULES, /node_modules/],
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
    modules: [path.join(PROJECT_ROOT, "node_modules")],
    extensions: [".ts", ".js", ".jsx", ".liquid", ".scss"],
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
