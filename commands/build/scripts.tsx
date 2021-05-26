import React from "react";
import CompilationFeedback from "../../helpers/CompilationFeedback";
import webpackConfig from "../../webpack/scripts/webpack.prod";

function BuildScripts() {
	return <CompilationFeedback webpackConfig={webpackConfig} type="scripts" />;
}

export default BuildScripts;
