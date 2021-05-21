// @ts-check

const webpack = require("webpack");
const path = require("path");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const fs = require("fs");

const PROJECT_ROOT = process.cwd();
const SCRIPTS_ROOT = path.resolve(PROJECT_ROOT, "src/scripts");
const PACKAGES_ROOT = path.resolve(SCRIPTS_ROOT, "packages");
const BUILER_ROOT = path.resolve(__dirname, "..");
const NODE_MODULES = path.resolve(PROJECT_ROOT, "node_modules");

function getPackages() {
  const packages = fs
    .readdirSync(PACKAGES_ROOT)
    .filter((name) => name !== ".DS_Store");

  return packages.reduce(
    (entries, package) => ({
      ...entries,
      [package]: path.resolve(
        PACKAGES_ROOT,
        fs.existsSync(`${PACKAGES_ROOT}/${package}/index.js`)
          ? `${PACKAGES_ROOT}/${package}/index.js`
          : `${PACKAGES_ROOT}/${package}/index.ts`
      ),
    }),
    {}
  );
}

module.exports = {
  entry: getPackages(),
  output: {
    filename: "[name].bundle.js",
    path: `${PROJECT_ROOT}/assets`,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx?)$/,
        exclude: [NODE_MODULES, /node_modules/],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/env", "@babel/react"],
          },
        },
      },
      {
        test: /\.(ts|tsx?)$/,
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
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      lib: path.resolve(SCRIPTS_ROOT, "./lib"),
    },
  },
  optimization: {
    runtimeChunk: {
      name: "vendor",
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled",
      generateStatsFile: true,
    }),
  ],
};
