import React from "react";
import CompilationFeedback from "../../helpers/CompilationFeedback";
import webpackConfig from "../../webpack/scripts/webpack.dev.js";

function WatchScripts() {
	return (
		<CompilationFeedback webpackConfig={webpackConfig} type="scripts" watch />
	);
}

export default WatchScripts;
