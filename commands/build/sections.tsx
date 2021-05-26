import React from "react";
import CompilationFeedback from "../../helpers/CompilationFeedback";
import webpackConfig from "../../webpack/sections/webpack.prod";

function BuildSections() {
	return <CompilationFeedback webpackConfig={webpackConfig} type="sections" />;
}

export default BuildSections;
