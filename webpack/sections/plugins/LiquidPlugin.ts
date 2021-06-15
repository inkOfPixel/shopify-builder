// @ts-check

const path = require("path");
const ConcatSource = require("webpack-sources").ConcatSource;
import { Chunk, Compilation, Compiler } from "webpack";

class LiquidPlugin {
	chunkVersions: Record<string, string>;
	startTime: number;
	constructor() {
		this.startTime = Date.now();
		this.chunkVersions = {};
	}

	emitLiquidAssetsForChunks(compilation: Compilation, chunks: Chunk[]): void {
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

	apply(compiler: Compiler) {
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

export default LiquidPlugin;
