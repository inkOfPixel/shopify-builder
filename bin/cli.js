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

const ROOT = path.resolve(__dirname, "../.");

async function run() {
  console.log("RUN BUILDER");

  // buildSections();
  // buildScripts();
  watchSections();
  // watchScripts();
}

run();

// function buildSections(watch) {
//   const sectionWebpackConfig = require(path.resolve(
//     __dirname,
//     "../sections/webpack.config.js"
//   ));
//   console.log("build sections");
//   const compiler = webpack(sectionWebpackConfig);

//   new webpack.ProgressPlugin().apply(compiler);

//   compiler.run((err, stats) => {
//     if (err) {
//       console.log(err);
//     }
//     compiler.close((closeErr) => {});
//   });
// }

// function buildScripts(watch) {
//   console.log("build scripts");
//   const compiler = webpack(scriptsWebpackConfigDev);
//   new webpack.ProgressPlugin().apply(compiler);

//   compiler.run((err, stats) => {
//     if (err) {
//       console.log(err);
//     }
//     compiler.close((closeErr) => {});
//   });
// }

function watchScripts() {
  console.log("watch scripts");
  const scriptsWebpackConfigDevPath = path.resolve(
    ROOT,
    "config/scripts/webpack.dev.js"
  );

  console.log("scriptsWebpackConfigDevPath", scriptsWebpackConfigDevPath);

  console.log("process.cwd", process.cwd());

  const script = [
    `cross-env NODE_ENV=development ${path.resolve(
      process.cwd(),
      "node_modules/.bin/webpack"
    )} --progress --watch`,
    `--config="${scriptsWebpackConfigDevPath}"`,
  ].join(" ");
  console.log("script", script);

  let childProcess = spawn(script, {
    stdio: "inherit",
    shell: true,
  });

  childProcess.stdout?.on("data", function (data) {
    console.log(data.toString());
  });

  childProcess.stderr?.on("data", function (data) {
    console.log(data.toString());
  });

  childProcess.on("exit", (code, signal) => {
    if (code === null) {
      code = signal === "SIGINT" ? 130 : 1;
    }

    process.exitCode = code;
  });
}

function watchSections() {
  console.log("watch sections");
  const sectionsWebpackConfigPath = path.resolve(
    ROOT,
    "config/sections/webpack.config.js"
  );

  const script = [
    `cross-env NODE_ENV=development ${path.resolve(
      process.cwd(),
      "node_modules/.bin/webpack"
    )} --progress --watch`,
    `--config="${sectionsWebpackConfigPath}"`,
  ].join(" ");
  console.log("script", script);

  let childProcess = spawn(script, {
    stdio: "inherit",
    shell: true,
  });

  childProcess.stdout?.on("data", function (data) {
    console.log(data.toString());
  });

  childProcess.stderr?.on("data", function (data) {
    console.log(data.toString());
  });

  childProcess.on("exit", (code, signal) => {
    if (code === null) {
      code = signal === "SIGINT" ? 130 : 1;
    }

    process.exitCode = code;
  });
}

// function watchSections(watch) {
//   console.log("build sections");
//   const compiler = webpack(sectionWebpackConfig);

//   new webpack.ProgressPlugin().apply(compiler);

// const watching = compiler.build({}, (err, stats) => {
//   if (err) {
//     console.log(err);
//   }
// });

// watching.close((closeErr) => {
//   console.log("Watching Ended.");
// });
// }

// function buildScripts(watch) {
//   console.log("build sections");
//   const compiler = webpack(scriptsWebpackConfigDev);
//   new webpack.ProgressPlugin().apply(compiler);
//   compiler[watch]((err, stats) => {
//     compiler.close((closeErr) => {});
//   });
// }
