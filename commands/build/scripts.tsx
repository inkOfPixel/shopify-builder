import React from "react";
import FeedbackTemplate from "../../helpers/FeedbackTemplate";
import useCommand from "../../helpers/useCommand";
const path = require("path");

function BuildScripts() {
	const webpackConfigPath = path.resolve(
		process.cwd(),
		`node_modules/shopify-builder/config/scripts/webpack.prod.js`
	);
	const command = [
		`cross-env NODE_ENV=production`,
		` ${path.resolve(process.cwd(), "node_modules/.bin/webpack")}`,
		`--config="${webpackConfigPath}"`,
	].join(" ");
	const { output, error } = useCommand(command);
	return <FeedbackTemplate output={output} error={error} />;
}

export default BuildScripts;
