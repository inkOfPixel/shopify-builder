#!/usr/bin/env node

// @ts-check

const { Command } = require("commander");
const { spawn } = require("child_process");
const path = require("path");
// const pkg = require("../package.json");
const webpack = require("webpack");

console.log(path.resolve(__dirname, "../sections/webpack.config.js"));

const sectionWebpackConfig = require(path.resolve(
  __dirname,
  "../sections/webpack.config.js"
));
console.log("sectionWebpackConfig", sectionWebpackConfig);

console.log("RUN");

async function run() {
  console.log("RUN BUILDER");
  const program = new Command();
  buildSections();
}

run();

function buildSections() {
  console.log("build sections");
  const compiler = webpack(sectionWebpackConfig);

  new webpack.ProgressPlugin().apply(compiler);
  compiler.run((err, stats) => {
    compiler.close((closeErr) => {});
  });
}
