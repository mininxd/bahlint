/**
 * @fileoverview Gasoline-themed reporter for Bahlint.
 * Inspired by the default stylish formatter, but with a fuel-oriented twist.
 * @author ESLint
 */
"use strict";

const util = require("node:util"),
	table = require("../../shared/text-table");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Returns a styling function based on the color option.
 * @param {boolean|undefined} color Indicates whether to use colors.
 * @returns {Function} A function that styles text.
 */
function getStyleText(color) {
	if (typeof color === "undefined") {
		return (format, text) =>
			util.styleText(format, text, { validateStream: true });
	}
	if (color) {
		return (format, text) =>
			util.styleText(format, text, { validateStream: false });
	}
	return (_, text) => text;
}

/**
 * Given a word and a count, append an s if count is not one.
 * @param {string} word A word in its singular form.
 * @param {number} count A number controlling whether word should be pluralized.
 * @returns {string} The original word with an s on the end if count is not one.
 */
function pluralize(word, count) {
	return count === 1 ? word : `${word}s`;
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (results, data) {
	const styleText = getStyleText(data?.color);

	let output = "\n",
		errorCount = 0,
		warningCount = 0,
		fixableErrorCount = 0,
		fixableWarningCount = 0;

	results.forEach(result => {
		const messages = result.messages;

		if (messages.length === 0) {
			return;
		}

		errorCount += result.errorCount;
		warningCount += result.warningCount;
		fixableErrorCount += result.fixableErrorCount;
		fixableWarningCount += result.fixableWarningCount;

		// Highlight file path like a fuel line.
		output += `${styleText(
			"underline",
			styleText("yellow", result.filePath),
		)}\n`;

		output += `${table(
			messages.map(message => {
				const line = String(message.line || 0);
				const column = String(message.column || 0);
				const isError = message.fatal || message.severity === 2;

				const messageType = styleText(
					isError ? "red" : "yellow",
					isError ? "ERR" : "WARN",
				);

				return [
					"",
					line,
					column,
					messageType,
					message.message.replace(/([^ ])\.$/u, "$1"),
					message.ruleId ? styleText("dim", message.ruleId) : "",
				];
			}),
			{
				align: ["", "r", "l"],
				stringLength(str) {
					return util.stripVTControlCharacters(str).length;
				},
			},
		)
			.split("\n")
			.map(el =>
				el.replace(/(\d+)\s+(\d+)/u, (m, p1, p2) =>
					styleText("dim", `${p1}:${p2}`),
				),
			)
			.join("\n")}\n\n`;
	});

	const total = errorCount + warningCount;

	/*
	 * We can't use a single `styleText` call like `styleText([summaryColor, "bold"], text)` here.
	 * This is a bug in `util.styleText` in Node.js versions earlier than v22.15.0 (https://github.com/nodejs/node/issues/56717).
	 * As a workaround, we use nested `styleText` calls.
	 */
	if (total > 0) {
		let summaryColor;
		let statusLabel;

		if (errorCount > 0) {
			summaryColor = "red";
			statusLabel = "ENGINE KNOCK";
		} else {
			summaryColor = "yellow";
			statusLabel = "LOW OCTANE";
		}

		const summaryText = [
			"[BAHLINT] FUEL STATUS: ",
			statusLabel,
			" - ",
			total,
			pluralize(" issue", total),
			" (",
			errorCount,
			pluralize(" error", errorCount),
			", ",
			warningCount,
			pluralize(" warning", warningCount),
			")",
		].join("");

		output += `${styleText(
			summaryColor,
			styleText("bold", summaryText),
		)}\n`;

		if (fixableErrorCount > 0 || fixableWarningCount > 0) {
			const fixSummaryText = [
				"[BAHLINT]  ",
				fixableErrorCount,
				pluralize(" error", fixableErrorCount),
				" and ",
				fixableWarningCount,
				pluralize(" warning", fixableWarningCount),
				" potentially fixable with the `--fix` pit stop.",
			].join("");

			output += `${styleText(
				summaryColor,
				styleText("bold", fixSummaryText),
			)}\n`;
		}
	}

	// Resets output color, to prevent changes on the top level
	return total > 0 ? styleText("reset", output) : "";
};