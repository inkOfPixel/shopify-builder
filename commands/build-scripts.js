// @ts-check

import { Box, Text } from "ink";
import React from "react";
const { spawn } = require("child_process");

const path = require("path");
const ROOT = path.resolve(__dirname, "../.");

function BuildScripts() {
	const [output, setOutput] = React.useState("");
	const [outputError, setOutputError] = React.useState("");

	React.useEffect(() => {
		const scriptsWebpackConfigDev = path.resolve(
			ROOT,
			"../config/scripts/webpack.dev.js"
		);
		const script = [
			`NODE_ENV=development ${path.resolve(
				process.cwd(),
				"node_modules/.bin/webpack"
			)} --progress --watch`,
			`--config="${scriptsWebpackConfigDev}"`,
		].join(" ");
		let childProcess = spawn(script, {
			stdio: "inherit",
			shell: true,
		});
		childProcess.stdout?.on("data", function (data) {
			setOutput(data.toString());
		});
		childProcess.stderr?.on("data", function (data) {
			setOutputError(data.toString());
		});
	}, []);

	return (
		<Box flexDirection="column" padding={1}>
			<Box marginTop={1}>
				<Text color="green">{output}</Text>
			</Box>
			<Box marginTop={1}>
				<Text color="red">{outputError}</Text>
			</Box>
		</Box>
	);
}

BuildScripts.propTypes = {};

export default BuildScripts;
