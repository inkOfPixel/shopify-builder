import React from "react";
const { spawn } = require("child_process");

function useCommand(command: string) {
	const [output, setOutput] = React.useState("");
	const [error, setError] = React.useState("");

	React.useEffect(() => {
		let childProcess = spawn(command, {
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
