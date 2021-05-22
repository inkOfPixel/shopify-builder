// @ts-check

const webpack = require("webpack");
const path = require("path");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const fs = require("fs");

const RUNNER_PROJECT_ROOT = process.cwd();
const SCRIPTS_ROOT = path.resolve(RUNNER_PROJECT_ROOT, "src/scripts");
const PACKAGES_ROOT = path.resolve(SCRIPTS_ROOT, "packages");
const BUILER_ROOT = path.resolve(__dirname, "../..");
const RUNNER_NODE_MODULES = path.resolve(RUNNER_PROJECT_ROOT, "node_modules");

function getPackages() {
  console.log("fs.existsSync(PACKAGES_ROOT)", fs.existsSync(PACKAGES_ROOT));

  if (!fs.existsSync(PACKAGES_ROOT)) {
    return {};
  }
  const packages = fs
    .readdirSync(PACKAGES_ROOT)
    .filter((name) => name !== ".DS_Store");

  return packages.reduce((entries, package) => {
    let fileEntry;
    if (fs.existsSync(`${PACKAGES_ROOT}/${package}/index.js`)) {
      fileEntry = `${PACKAGES_ROOT}/${package}/index.js`;
    } else if (fs.existsSync(`${PACKAGES_ROOT}/${package}/index.ts`)) {
      fileEntry = `${PACKAGES_ROOT}/${package}/index.ts`;
    } else if (fs.existsSync(`${PACKAGES_ROOT}/${package}/index.tsx`)) {
      fileEntry = `${PACKAGES_ROOT}/${package}/index.tsx`;
    }
    console.log("fileEntry", fileEntry);

    return {
      ...entries,
      [package]: path.resolve(PACKAGES_ROOT, fileEntry),
    };
  }, {});
}

module.exports = {
  entry: getPackages(),
  output: {
    filename: "[name].bundle.js",
    path: `${RUNNER_PROJECT_ROOT}/assets`,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx?)$/,
        exclude: [RUNNER_NODE_MODULES, /node_modules/],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/env", "@babel/react"],
          },
        },
      },
      {
        test: /\.(ts|tsx?)$/,
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
  resolveLoader: {
    modules: [RUNNER_NODE_MODULES],
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
