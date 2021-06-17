import { Box } from "ink";
import React from "react";
import BuildScripts from "./scripts";
import BuildSections from "./sections";

function Watch() {
	return (
		<Box flexDirection="column">
			<BuildScripts />
			<BuildSections />
		</Box>
	);
}

export default Watch;
