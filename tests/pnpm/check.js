import fs from "node:fs";

const nodeModulesURL = new URL("../../node_modules", import.meta.url);

if (fs.existsSync(nodeModulesURL)) {

	console.error("Delete node_modules to run the pnpm type support test.");
	process.exitCode = 1;
}
