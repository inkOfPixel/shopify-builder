import React from "react";
const { spawn } = require("child_process");
const path = require("path");
const ROOT = path.resolve(__dirname, "../.");

interface UseCommandProps {
	env: "prod" | "dev";
	scope: "script" | "section";
	watch?: boolean;
}

function useCommand({ env, scope, watch = false }: UseCommandProps) {
	const [output, setOutput] = React.useState("");
	const [error, setError] = React.useState("");

	React.useEffect(() => {
		const webpackConfigPath = path.resolve(
			ROOT,
			`../config/${scope}/webpack.${env}.js`
		);
		const script = [
			`cross-env NODE_ENV=development`,
			` ${path.resolve(process.cwd(), "node_modules/.bin/webpack")}`,
			`--progress ${watch ? "--watch" : ""}`,
			`--config="${webpackConfigPath}"`,
		].join(" ");

		let childProcess = spawn(script, {
			stdio: "inherit",
			shell: true,
		});
		childProcess.stdout?.on("data", function (data) {
			setOutput(data.toString());
		});
		childProcess.stderr?.on("data", function (data) {
			setError(data.toString());
		});
	}, []);

	return { output, error };
}

export default useCommand;
