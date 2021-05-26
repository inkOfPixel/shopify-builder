import React from "react";
import { Box, Text } from "ink";
const path = require("path");
const { spawn } = require("child_process");

function SubprocessOutput({ command }: { command: string }) {
	const [output, setOutput] = React.useState("");
	const [error, setError] = React.useState("");

	React.useEffect(() => {
		console.log("USE EFFECT");
		let childProcess = spawn(command, { stdio: "inherit", shell: true });

		childProcess.stdout?.on("data", function (data) {
			setOutput("HELLO!!!!!!");
		});
		childProcess.stderr?.on("data", function (data) {
			// setError(data.toString());
		});
	}, []);

	return (
		<Box flexDirection="column" padding={1}>
			<Text>Сommand output:</Text>
			<Box marginTop={1}>
				<Text>hello</Text>
			</Box>
		</Box>
	);
}

function Watch() {
	const webpackConfigPathScripts = path.resolve(
		process.cwd(),
		`node_modules/shopify-builder/config/scripts/webpack.dev.js`
	);

	const commandScripts = [
		`cross-env NODE_ENV=development`,
		` ${path.resolve(process.cwd(), "node_modules/.bin/webpack")}`,
		`--progress --watch`,
		`--config="${webpackConfigPathScripts}"`,
	].join(" ");

	// const { output: outputScripts, error: errorScripts } =
	// 	useCommand(commandScripts);
	// console.log("outputScripts", outputScripts);
	// console.log("errorScripts", errorScripts);
	const webpackConfigPathSections = path.resolve(
		process.cwd(),
		`node_modules/shopify-builder/config/sections/webpack.dev.js`
	);

	const commandSections = [
		`cross-env NODE_ENV=development`,
		` ${path.resolve(process.cwd(), "node_modules/.bin/webpack")}`,
		`--progress --watch`,
		`--config="${webpackConfigPathSections}"`,
	].join(" ");

	// const { output: outputSections, error: errorSections } =
	// 	useCommand(commandSections);
	// console.log("outputSections", outputSections);
	// console.log("errorSections", errorSections);

	return (
		<Box>
			<SubprocessOutput command={commandScripts} />
			<SubprocessOutput command={commandSections} />
		</Box>
	);
}

export default Watch;
