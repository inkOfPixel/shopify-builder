import { Box, Text } from "ink";
import React from "react";
import FeedbackTemplate from "../../helpers/FeedbackTemplate";
import useCommand from "../../helpers/useCommand";
const { spawn } = require("child_process");

const path = require("path");

function WatchScripts() {
	const webpackConfigPath = path.resolve(
		process.cwd(),
		`node_modules/shopify-builder/config/scripts/webpack.dev.js`
	);

	const command = [
		`cross-env NODE_ENV=development`,
		` ${path.resolve(process.cwd(), "node_modules/.bin/webpack")}`,
		`--progress --watch`,
		`--config="${webpackConfigPath}"`,
	].join(" ");

	const { output, error } = useCommand(command);
	console.log("output", output);
	console.log("error", error);
	return <FeedbackTemplate output={output} error={error} />;
}

export default WatchScripts;
