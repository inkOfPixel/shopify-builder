#!/usr/bin/env node

// @ts-check

const { Command } = require("commander");
const { spawn } = require("child_process");
const path = require("path");
// const pkg = require("../package.json");
const webpack = require("webpack");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const sectionWebpackConfig = require(path.resolve(
  __dirname,
  "../sections/webpack.config.js"
));

// const scriptsWebpackConfigDev = require(path.resolve(
//   __dirname,
//   "../scripts/webpack.dev.js"
// ));

// const scriptsWebpackConfigProd = require(path.resolve(
//   __dirname,
//   "../scripts/webpack.prod.js"
// ));

async function run() {
  console.log("RUN BUILDER", argv);

  buildSections();
  // buildScripts("watch");
}

run();

function buildSections(watch) {
  console.log("build sections");
  const compiler = webpack(sectionWebpackConfig);

  new webpack.ProgressPlugin().apply(compiler);

  compiler.run((err, stats) => {
    if (err) {
      console.log(err);
    }
    compiler.close((closeErr) => {});
  });
}

// function watchSections(watch) {
//   console.log("build sections");
//   const compiler = webpack(sectionWebpackConfig);

//   new webpack.ProgressPlugin().apply(compiler);

//   const watching = compiler.build({}, (err, stats) => {
//     if (err) {
//       console.log(err);
//     }
//   });

//   watching.close((closeErr) => {
//     console.log("Watching Ended.");
//   });
// }

// function buildScripts(watch) {
//   console.log("build sections");
//   const compiler = webpack(scriptsWebpackConfigDev);
//   new webpack.ProgressPlugin().apply(compiler);
//   compiler[watch]((err, stats) => {
//     compiler.close((closeErr) => {});
//   });
// }
