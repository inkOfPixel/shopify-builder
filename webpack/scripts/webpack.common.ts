// @ts-check

import path from "path";
const BundleAnalyzerPlugin =
	require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
import fs from "fs";
import WebpackBuildNotifierPlugin from "webpack-build-notifier";

const RUNNER_PROJECT_ROOT = process.cwd();
const SCRIPTS_ROOT = path.resolve(RUNNER_PROJECT_ROOT, "src/scripts");
const PACKAGES_ROOT = path.resolve(SCRIPTS_ROOT, "packages");
const RUNNER_NODE_MODULES = path.resolve(RUNNER_PROJECT_ROOT, "node_modules");

function getPackages() {
	if (!fs.existsSync(PACKAGES_ROOT)) {
		return {};
	}
	const packages = fs
		.readdirSync(PACKAGES_ROOT)
		.filter((name) => name !== ".DS_Store");

	return packages.reduce((entries, packageName) => {
		let fileEntry;
		if (fs.existsSync(`${PACKAGES_ROOT}/${packageName}/index.js`)) {
			fileEntry = `${PACKAGES_ROOT}/${packageName}/index.js`;
		} else if (fs.existsSync(`${PACKAGES_ROOT}/${packageName}/index.ts`)) {
			fileEntry = `${PACKAGES_ROOT}/${packageName}/index.ts`;
		} else if (fs.existsSync(`${PACKAGES_ROOT}/${packageName}/index.tsx`)) {
			fileEntry = `${PACKAGES_ROOT}/${packageName}/index.tsx`;
		}

		return {
			...entries,
			[packageName]: path.resolve(PACKAGES_ROOT, fileEntry),
		};
	}, {});
}

export default {
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
			title: "Scripts compilation",
			logo: path.resolve("./img/favicon.png"),
			suppressSuccess: false,
			showDuration: true,
		}),
	],
};
