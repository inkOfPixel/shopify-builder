// @ts-check

import path from "path";
import fs from "fs";
import LiquidPlugin from "./plugins/LiquidPlugin";
import AfterEmitPlugin from "./plugins/AfterEmitPlugin";
import WebpackBuildNotifierPlugin from "webpack-build-notifier";

const RUNNER_PROJECT_ROOT = process.cwd();
const SRC_ROOT = path.resolve(RUNNER_PROJECT_ROOT, "src");
const RUNNER_NODE_MODULES = path.resolve(RUNNER_PROJECT_ROOT, "node_modules");
const LOADERS_PATH = path.resolve(
	process.cwd(),
	"node_modules/@inkofpixel/shopify-builder/webpack/sections/loaders"
);

function getSections() {
	if (!fs.existsSync(path.resolve(RUNNER_PROJECT_ROOT, "src/sections"))) {
		return {};
	}
	const sections = fs
		.readdirSync(path.resolve(RUNNER_PROJECT_ROOT, "src/sections"))
		.filter((name) => name !== ".DS_Store");

	return sections.reduce(
		(entries, section) => ({
			...entries,
			[section]: path.resolve(
				RUNNER_PROJECT_ROOT,
				`src/sections/${section}/index.liquid`
			),
		}),
		{}
	);
}

const config = {
	entry: getSections(),
	output: {
		path: path.resolve(RUNNER_PROJECT_ROOT, "sections"),
		filename: "[name].js",
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
	mode: "production",
	module: {
		rules: [
			{
				test: /\.ts$/,
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
				test: /\.js$/,
				exclude: [RUNNER_NODE_MODULES, /node_modules/],
				use: ["babel-loader"],
			},
			{
				test: /\.s?css$/,
				use: [
					"raw-loader",
					"extract-loader",
					{
						loader: "css-loader",
						options: {
							importLoaders: 1,
						},
					},
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [["autoprefixer"]],
							},
						},
					},
					{
						loader: "sass-loader",
					},
					{
						loader: "style-resources-loader",
						options: {
							patterns: [
								`${path.resolve(SRC_ROOT, "lib/variables.scss")}`,
								`${path.resolve(SRC_ROOT, "lib/mixins.scss")}`,
							],
						},
					},
				],
			},
			{
				test: /\.json$/,
				exclude: [RUNNER_NODE_MODULES, /node_modules/],
				use: ["raw-loader", { loader: "extract-loader" }],
			},
			{
				test: /\.liquid$/,
				use: [{ loader: "liquid-loader" }],
			},
		],
	},
	plugins: [
		// new webpack.ProgressPlugin(),
		new LiquidPlugin(),
		new AfterEmitPlugin(),
		new WebpackBuildNotifierPlugin({
			title: "Section compilation",
			logo: path.resolve("./img/favicon.png"),
			suppressSuccess: true, // don't spam success notifications
		}),
	],
	resolve: {
		modules: [path.join(RUNNER_PROJECT_ROOT, "node_modules")],
		extensions: [".ts", ".js", ".liquid", ".scss"],
		alias: {
			lib: path.resolve(SRC_ROOT, "lib"),
		},
	},
	resolveLoader: {
		// modules: [path.resolve(__dirname, "loaders"), "node_modules"],
		modules: [LOADERS_PATH, "node_modules"],

		extensions: [".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"],
	},
};

export default config;
