// @ts-check

const path = require("path");
const BundleAnalyzerPlugin =
	require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const fs = require("fs");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");

const RUNNER_PROJECT_ROOT = process.cwd();
const SCRIPTS_ROOT = path.resolve(RUNNER_PROJECT_ROOT, "src/scripts");
const PACKAGES_ROOT = path.resolve(SCRIPTS_ROOT, "packages");
const BUILER_ROOT = path.resolve(__dirname, "../..");
const RUNNER_NODE_MODULES = path.resolve(RUNNER_PROJECT_ROOT, "node_modules");

console.log("RUNNER_NODE_MODULES", RUNNER_NODE_MODULES);

function getPackages() {
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
		filename: "[name].iop.js",
		path: `${RUNNER_PROJECT_ROOT}/assets`,
	},
	watchOptions: {
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
				test: /\.jsx?$/,
				exclude: [RUNNER_NODE_MODULES, /node_modules/],
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/env", "@babel/react"],
					},
				},
			},
			{
				test: /\.tsx?$/,
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
				use: ["style-loader", "css-loader", "sass-loader"],
			},
			{
				test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
				use: ["file-loader"],
			},
		],
	},
	resolve: {
		extensions: [".js", ".jsx", ".mjs", ".ts", ".tsx", ".json"],
		roots: [path.resolve(BUILER_ROOT, "node_modules")],
		alias: {
			lib: path.resolve(SCRIPTS_ROOT, "./lib"),
		},
	},
	resolveLoader: {
		modules: [RUNNER_NODE_MODULES],
	},
	optimization: {
		runtimeChunk: {
			name: "runtime",
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
		new WebpackBuildNotifierPlugin({
			title: "Scripts built",
			logo: path.resolve("./img/favicon.png"),
			suppressSuccess: false,
			showDuration: true,
		}),
	],
};
