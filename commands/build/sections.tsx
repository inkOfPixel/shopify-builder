import React from "react";
import Template from "../../helpers/template";
import useCommand from "../../helpers/useCommand";

function BuildSections() {
	const { output, error } = useCommand({ env: "prod", scope: "section" });
	return <Template output={output} error={error} />;
}

export default BuildSections;
