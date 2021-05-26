import React from "react";
import { Box, Text } from "ink";

interface TemplateProps {
	output: string;
	error: string;
}

function Template({ output, error }: TemplateProps) {
	return (
		<Box flexDirection="column" padding={1}>
			{output && (
				<Box marginTop={1}>
					<Text color="green">{output}</Text>
				</Box>
			)}
			{error && (
				<Box marginTop={1}>
					<Text color="red">{error}</Text>
				</Box>
			)}
		</Box>
	);
}

export default Template;
