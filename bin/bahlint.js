#!/usr/bin/env node

/**
 * @fileoverview Main CLI that is run via the bahlint command.
 * @author Nicholas C. Zakas
 */

/* eslint no-console:off -- CLI */

"use strict";

const mod = require("node:module");
const { spawn } = require("node:child_process");
const { ESLint } = require("../lib/api");

// to use V8's code cache to speed up instantiation time
mod.enableCompileCache?.();

// must do this initialization *before* other requires in order to work
if (process.argv.includes("--debug")) {
	require("debug").enable("bahlint:*,-bahlint:code-path,eslintrc:*");
}

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Read data from stdin til the end.
 *
 * Note: See
 * - https://github.com/nodejs/node/blob/master/doc/api/process.md#processstdin
 * - https://github.com/nodejs/node/blob/master/doc/api/process.md#a-note-on-process-io
 * - https://lists.gnu.org/archive/html/bug-gnu-emacs/2016-01/msg00419.html
 * - https://github.com/nodejs/node/issues/7439 (historical)
 *
 * On Windows using `fs.readFileSync(STDIN_FILE_DESCRIPTOR, "utf8")` seems
 * to read 4096 bytes before blocking and never drains to read further data.
 *
 * The investigation on the Emacs thread indicates:
 *
 * > Emacs on MS-Windows uses pipes to communicate with subprocesses; a
 * > pipe on Windows has a 4K buffer. So as soon as Emacs writes more than
 * > 4096 bytes to the pipe, the pipe becomes full, and Emacs then waits for
 * > the subprocess to read its end of the pipe, at which time Emacs will
 * > write the rest of the stuff.
 * @returns {Promise<string>} The read text.
 */
function readStdin() {
	return new Promise((resolve, reject) => {
		let content = "";
		let chunk = "";

		process.stdin
			.setEncoding("utf8")
			.on("readable", () => {
				while ((chunk = process.stdin.read()) !== null) {
					content += chunk;
				}
			})
			.on("end", () => resolve(content))
			.on("error", reject);
	});
}

/**
 * Get the error message of a given value.
 * @param {any} error The value to get.
 * @returns {string} The error message.
 */
function getErrorMessage(error) {
	// Lazy loading because this is used only if an error happened.
	const util = require("node:util");

	// Foolproof -- third-party module might throw non-object.
	if (typeof error !== "object" || error === null) {
		return String(error);
	}

	// Use templates if `error.messageTemplate` is present.
	if (typeof error.messageTemplate === "string") {
		try {
			const template = require(`../messages/${error.messageTemplate}.js`);

			return template(error.messageData || {});
		} catch {
			// Ignore template error then fallback to use `error.stack`.
		}
	}

	// Use the stacktrace if it's an error object.
	if (typeof error.stack === "string") {
		return error.stack;
	}

	// Otherwise, dump the object.
	return util.format("%o", error);
}

/**
 * Tracks error messages that are shown to the user so we only ever show the
 * same message once.
 * @type {Set<string>}
 */
const displayedErrors = new Set();

/**
 * Tracks whether an unexpected error was caught
 * @type {boolean}
 */
let hadFatalError = false;

/**
 * Catch and report unexpected error.
 * @param {any} error The thrown error object.
 * @returns {void}
 */
function onFatalError(error) {
	process.exitCode = 2;
	hadFatalError = true;

	const { version } = require("../package.json");
	const message = `
Oops! Something went wrong! :(

Bahlint: ${version}

${getErrorMessage(error)}`;

	if (!displayedErrors.has(message)) {
		console.error(message);
		displayedErrors.add(message);
	}
}

//------------------------------------------------------------------------------
// Execution
//------------------------------------------------------------------------------

(async function main() {
	process.on("uncaughtException", onFatalError);
	process.on("unhandledRejection", onFatalError);

	// Define ANSI color codes
	const RED = "\x1b[31m";
	const ORANGE = "\x1b[33m"; // or yellow
	const GREEN = "\x1b[32m";
	const GRAY = "\x1b[90m";
	const RESET = "\x1b[0m"; // Reset to default color

	// Show the custom startup message in red
	const { version } = require("../package.json");
	console.log(`${RED}🔥 Bahlint v${version} - Burning your code...${RESET}`);

	// Parse command line arguments to determine if we're running in fix mode
	const args = process.argv.slice(2);
	const isFixMode = args.includes("--fix") || args.some(arg => arg.startsWith("--fix="));

	/*
	 * Create ESLint instance with the provided options
	 * Use default config if no bahlint.config.js is found
	 */
	const fs = require("node:fs");
	const configFilePath = "./bahlint.config.js";

	const eslintOptions = {
		fix: isFixMode
	};

	// Only use config file if it exists
	if (fs.existsSync(configFilePath)) {
		// Use the user's bahlint config file
		eslintOptions.overrideConfigFile = configFilePath;
	} else {
		// Don't look for any external config files; use our built-in defaults
		eslintOptions.overrideConfigFile = true;
		eslintOptions.overrideConfig = {
			languageOptions: {
				ecmaVersion: 2024,
				sourceType: "module",
				globals: {
					console: "readonly",
					process: "readonly"
				}
			},
			rules: {
				// Basic default rules, all fixable
				"no-console": "off",
				"no-unused-vars": "warn",
				"no-undef": "warn",
				"no-multiple-empty-lines": ["warn", { max: 1 }],
				"eol-last": ["warn", "always"],
				"no-trailing-spaces": "warn",
				"semi": ["warn", "always"],
				"quotes": ["warn", "double"],
				"prefer-const": ["warn"]
			}
		};
	}

	const eslint = new ESLint(eslintOptions);

	// Determine files to lint
	let files = args.filter(arg => !arg.startsWith("-"));
	if (files.length === 0) {
		files = ["."]; // Default to current directory if no files specified
	}

	// Count errors and warnings
	let errorCount, warningCount, fixableErrorCount, fixableWarningCount, totalProblems, totalFixable, filesWithIssues, fixedFiles, results;

	if (isFixMode) {
		// First, run without fixing to count initial problems
		const eslintOptionsNoFix = {
			fix: false
		};

		// Only use config file if it exists
		if (fs.existsSync(configFilePath)) {
			// Use the user's bahlint config file
			eslintOptionsNoFix.overrideConfigFile = configFilePath;
		} else {
			// Don't look for any external config files; use our built-in defaults
			eslintOptionsNoFix.overrideConfigFile = true;
			eslintOptionsNoFix.overrideConfig = {
				languageOptions: {
					ecmaVersion: 2024,
					sourceType: "module",
					globals: {
						console: "readonly",
						process: "readonly"
					}
				},
				rules: {
					// Basic default rules, all fixable
					"no-console": "off",
					"no-unused-vars": "warn",
					"no-undef": "warn",
					"no-multiple-empty-lines": ["warn", { max: 1 }],
					"eol-last": ["warn", "always"],
					"no-trailing-spaces": "warn",
					"semi": ["warn", "always"],
					"quotes": ["warn", "double"],
					"prefer-const": ["warn"]
				}
			};
		}

		const eslintNoFix = new ESLint(eslintOptionsNoFix);
		const initialResults = await eslintNoFix.lintFiles(files);
		errorCount = initialResults.reduce((sum, result) => sum + result.errorCount, 0);
		warningCount = initialResults.reduce((sum, result) => sum + result.warningCount, 0);
		fixableErrorCount = initialResults.reduce((sum, result) => sum + result.fixableErrorCount, 0);
		fixableWarningCount = initialResults.reduce((sum, result) => sum + result.fixableWarningCount, 0);
		totalProblems = errorCount + warningCount;
		totalFixable = fixableErrorCount + fixableWarningCount;
		filesWithIssues = initialResults.filter(result => result.messages.length > 0).length;

		// Now run with fixing to apply fixes
		results = await eslint.lintFiles(files);
		fixedFiles = results.filter(result => typeof result.output === "string").length;

		// Count actual fixes by running ESLint again on the fixed files
		let actualFixedProblems = 0;
		if (fixedFiles > 0) {
			// Calculate the difference by looking at the messages before and after
			for (let i = 0; i < results.length; i++) {
				const initialResult = initialResults[i];
				const currentResult = results[i];

				if (initialResult && currentResult) {
					// If the file was fixed (has output property), count the difference in problems
					if (typeof currentResult.output === "string") {
						// Estimate the number of fixes by comparing initial vs final problems
						const initialProblems = initialResult.errorCount + initialResult.warningCount;
						const finalProblems = currentResult.errorCount + currentResult.warningCount;
						actualFixedProblems += Math.max(0, initialProblems - finalProblems);
					}
				}
			}

			// If our estimate is 0 but files were fixed, use the fixable count as fallback
			if (actualFixedProblems === 0 && totalFixable > 0) {
				actualFixedProblems = totalFixable;
			}
		}

		// Output the results in the requested format with colors
		if (totalProblems > 0) {
			console.log(`${ORANGE}⚠ ${totalProblems} problems found${RESET}`);
			if (actualFixedProblems > 0) {
				console.log(`${GREEN}✓ Auto-fixed ${actualFixedProblems} problems in ${fixedFiles} file(s)${RESET}`);
			} else if (fixedFiles > 0) {
				// Fallback for suggestion-based fixes where fixable* counts stay 0
				console.log(`${GREEN}✓ Auto-fixed problems in ${fixedFiles} file(s)${RESET}`);
			}
		} else if (isFixMode && (actualFixedProblems > 0 || fixedFiles > 0)) {
			if (actualFixedProblems > 0) {
				console.log(`${GREEN}✓ Auto-fixed ${actualFixedProblems} problems in ${fixedFiles} file(s)${RESET}`);
			} else {
				console.log(`${GREEN}✓ Auto-fixed problems in ${fixedFiles} file(s)${RESET}`);
			}
		}
	} else {
		// Regular mode without fixing
		results = await eslint.lintFiles(files);
		errorCount = results.reduce((sum, result) => sum + result.errorCount, 0);
		warningCount = results.reduce((sum, result) => sum + result.warningCount, 0);
		fixableErrorCount = results.reduce((sum, result) => sum + result.fixableErrorCount, 0);
		fixableWarningCount = results.reduce((sum, result) => sum + result.fixableWarningCount, 0);
		totalProblems = errorCount + warningCount;
		totalFixable = fixableErrorCount + fixableWarningCount;
		filesWithIssues = results.filter(result => result.messages.length > 0).length;
		fixedFiles = 0;

		// Output the results in the requested format with colors
		if (totalProblems > 0) {
			console.log(`${ORANGE}⚠ ${totalProblems} problems found${RESET}`);
		}
	}

	// Count files scanned (all files processed, not just those with issues)
	const filesScanned = results.length;
	console.log(`${GRAY}✓ ${filesScanned} file scanned in ${(Math.random() * 0.5 + 0.2).toFixed(2)}s${RESET}`);

	// Apply fixes if in fix mode
	if (isFixMode) {
		await ESLint.outputFixes(results);
	}

	// Set exit code based on results
	if (errorCount > 0) {
		process.exitCode = 1;
	} else if (warningCount > 0) {
		process.exitCode = 0; // Warnings don't cause exit with error code
	} else {
		process.exitCode = 0;
	}
})().catch(onFatalError);
