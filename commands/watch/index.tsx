import { Box } from "ink";
import React from "react";
import WatchScripts from "./scripts";
import WatchSections from "./sections";

function Watch() {
	return (
		<Box flexDirection="column">
			<WatchScripts />
			<WatchSections />
		</Box>
	);
}

export default Watch;
