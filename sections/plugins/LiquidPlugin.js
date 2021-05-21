// @ts-check

const path = require("path");
const chalk = require("chalk");
const ConcatSource = require("webpack-sources").ConcatSource;

class LiquidPlugin {
  constructor() {
    this.startTime = Date.now();
    this.prevTimestamps = new Map();

    this.chunkVersions = {};
  }

  getChangedFiles(compilation) {
    const changedFiles = Object.keys(compilation.fileTimestamps).filter(
      (watchfile) =>
        (this.previousTimestamps[watchfile] || this.startTime) <
        (compilation.fileTimestamps[watchfile] || Infinity)
    );
    this.previousTimestamps = compilation.fileTimestamps;
    return changedFiles;
  }

  getChangedChunk(compilation) {
    const changedFiles = this.getChangedFiles(compilation);
    return Array.from(compilation.chunks).filter((chunk) =>
      changedFiles.some((file) =>
        chunk.entryModule.fileDependencies.includes(file)
      )
    );
  }

  emitLiquidAssetsForChunks(compilation, chunks) {
    const assetsParts = {};
    Object.keys(compilation.assets).forEach((filename) => {
      const { name } = path.parse(filename);
      assetsParts[name] = assetsParts[name] || {};
      if (path.extname(filename) === ".liquid") {
        assetsParts[name].liquid = compilation.assets[filename];
      } else if (path.extname(filename) === ".js") {
        assetsParts[name].js = compilation.assets[filename];
      }
    });
    const chunksNames = chunks.map((chunk) => chunk.name);
    compilation.assets = Object.keys(assetsParts).reduce((assets, name) => {
      if (chunksNames.length === 0 || chunksNames.includes(name)) {
        return {
          ...assets,
          [`${name}.liquid`]: sectionSource(assetsParts[name]),
        };
      }
      return assets;
    }, {});
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync("LiquidPlugin", (compilation, callback) => {
      var changedChunks = Array.from(compilation.chunks).filter((chunk) => {
        var oldVersion = this.chunkVersions[chunk.name];
        this.chunkVersions[chunk.name] = chunk.hash;
        return chunk.hash !== oldVersion;
      });
      this.emitLiquidAssetsForChunks(compilation, changedChunks);

      callback();
    });
  }
}

function sectionSource(assetParts) {
  const sources = [];
  if (assetParts.js) {
    sources.push(
      `{% javascript %}${assetParts.js.source()}{% endjavascript %}`
    );
  }
  sources.push(assetParts.liquid);
  return new ConcatSource(...sources);
}

module.exports = LiquidPlugin;
