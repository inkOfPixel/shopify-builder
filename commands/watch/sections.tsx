import React from "react";
import CompilationFeedback from "../../helpers/CompilationFeedback";
import webpackConfig from "../../webpack/sections/webpack.dev.js";

function WatchSections() {
	return (
		<CompilationFeedback webpackConfig={webpackConfig} type="sections" watch />
	);
}

export default WatchSections;
