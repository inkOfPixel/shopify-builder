import React from "react";
import Template from "../../helpers/template";
import useCommand from "../../helpers/useCommand";

function BuildScripts() {
	const { output, error } = useCommand({ env: "prod", scope: "script" });
	return <Template output={output} error={error} />;
}

export default BuildScripts;
