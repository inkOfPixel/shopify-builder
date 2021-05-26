import React from "react";
import Template from "../../helpers/template";
import useCommand from "../../helpers/useCommand";

function WatchScripts() {
	const { output, error } = useCommand({
		env: "dev",
		scope: "script",
		watch: true,
	});
	return <Template output={output} error={error} />;
}

export default WatchScripts;
