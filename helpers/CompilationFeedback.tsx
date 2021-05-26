import { Box, Text } from "ink";
import React from "react";
import { Configuration } from "webpack";
import useCompilation from "../hooks/useCompilation";

interface CompilationFeedback {
	webpackConfig: Configuration;
	watch?: boolean;
	type: "scripts" | "sections";
}

function CompilationFeedback({
	webpackConfig,
	watch,
	type,
}: CompilationFeedback) {
	const { currentStep, percentage, errors, warnings } = useCompilation(
		webpackConfig,
		watch,
		type
	);

	return (
		<Box>
			{percentage !== 100 ? (
				<Text bold>
					🏗️ {type}: {currentStep} {percentage}%
				</Text>
			) : (
				<Text bold color="green">
					🎉🎉🎉 {type} compiled: watching for changes 👀
				</Text>
			)}
			{warnings.length > 0 ? (
				<Box flexDirection="column">
					{warnings.map((warning) => (
						<Text color="yellow">{warning}</Text>
					))}
				</Box>
			) : null}
			{errors.length > 0 ? (
				<Box flexDirection="column">
					{errors.map((error) => (
						<Text bold color="red">
							{error}
						</Text>
					))}
				</Box>
			) : null}
		</Box>
	);
}

export default CompilationFeedback;
