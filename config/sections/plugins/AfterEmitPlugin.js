const fs = require("fs");
const chalk = require("chalk");
const _ = require("lodash");
const RawSource = require("webpack-sources").RawSource;

class AfterEmitPlugin {
	apply(compiler) {
		compiler.hooks.emit.tap("after-emit", function emit(compilation) {
			setTimeout(() => {
				const emittedAssets = _.filter(
					compilation.assets,
					(asset) => asset.emitted
				);
				emittedAssets.forEach((asset) => {
					fs.writeFile(
						asset.existsAt,
						getSource(asset),
						function onWrite(error) {
							if (error) {
								console.log(
									chalk`\n{bgRed  ERROR } {red AfterEmitPlugin ${error.message}}`
								);
							}
						}
					);
				});
			}, 2000);
		});
	}
}

function getSource(asset) {
	return asset.children.reduce((source, child) => {
		if (child instanceof RawSource) {
			return (source += child._value);
		} else if (typeof child === "string") {
			return (source += child);
		}
		throw new Error("Invalid asset child for", asset.existsAt);
	}, "");
}

module.exports = AfterEmitPlugin;
