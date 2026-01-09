import { FC, useMemo, useState } from "react";
import FlameIcon from "./FlameIcon";
import { colorizeJS } from "../lib/libFormater";

type Cmd = { id: "npm" | "yarn" | "pnpm"; label: string; command: string };

const CopyIcon = ({ success }: { success: boolean }) =>
	success ? (
		<svg
			className="w-4 h-4 text-success"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M5 13l4 4L19 7"
			/>
		</svg>
	) : (
		<svg
			className="w-4 h-4"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
			/>
		</svg>
	);

const InstallSection: FC = () => {
	const [copied, setCopied] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<Cmd["id"]>("npm");

	const commands: Cmd[] = [
		{ id: "npm", label: "npm", command: "npm install bahlint --save-dev" },
		{ id: "yarn", label: "yarn", command: "yarn add bahlint --dev" },
		{ id: "pnpm", label: "pnpm", command: "pnpm add bahlint -D" },
	];

	const activeCommand = useMemo(
		() => commands.find(c => c.id === activeTab) ?? commands[0],
		[activeTab],
	);

	const copyToClipboard = async (text: string, id: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(id);
			window.setTimeout(() => setCopied(null), 2000);
		} catch {
			// optional: show toast
		}
	};

	const runCmd = ["npx bahlint . --fix"];

	// Raw text lines (what you want to display)
	const configLines = [
		'import js from "@eslint/js";',
		"",
		"export default [",
		"  js.configs.recommended,",
		"",
		"  {",
		'    files: ["**/*.{js,mjs,cjs}"],',
		"    languageOptions: {",
		'      ecmaVersion: "latest",',
		'      sourceType: "module"',
		"    },",
		"    rules: {",
		'      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],',
		'      "no-console": "off",',
		'      "no-debugger": "warn"',
		"    }",
		"  }",
		"];",
	];

	return (
		<section id="install" className="py-16 px-4 bg-base-200/50">
			<div className="max-w-2xl mx-auto">
				{/* Section Header */}
				<div className="text-center mb-10">
					<span className="badge badge-outline badge-secondary mb-4">
						Quick Start
					</span>
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						<FlameIcon size={32} className="inline-block mr-2" />
						Ignite Your Project
					</h2>
					<p className="text-base-content/60">
						Get started in seconds. Just add fuel and burn!
					</p>
				</div>

				{/* Install Card */}
				<div className="card bg-base-300 border border-base-content/10">
					<div className="card-body p-4 md:p-6">
						{/* Package Manager Tabs */}
						<div className="tabs tabs-boxed mb-4">
							{commands.map(cmd => (
								<button
									key={cmd.id}
									className={`tab ${activeTab === cmd.id ? "tab-active" : ""}`}
									onClick={() => setActiveTab(cmd.id)}
									type="button"
								>
									{cmd.label}
								</button>
							))}
						</div>

						{/* Command */}
						<div className="relative">
							<div className="mockup-code bg-base-100 border border-base-content/10">
								<pre
									data-prefix="$"
									className="text-sm md:text-base"
								>
									<code>{activeCommand.command}</code>
								</pre>
							</div>

							<button
								onClick={() =>
									copyToClipboard(
										activeCommand.command,
										activeCommand.id,
									)
								}
								className="btn btn-sm btn-ghost absolute top-3 right-3"
								aria-label="Copy command"
								type="button"
							>
								<CopyIcon
									success={copied === activeCommand.id}
								/>
							</button>
						</div>

						{/* Usage Example */}
						<div className="divider text-sm text-base-content/40">
							Then run
						</div>

						<div className="relative">
							<div className="mockup-code bg-base-100 border border-base-content/10">
								{runCmd.map((line, i) => (
									<pre key={i} data-prefix={String("$")}>
										<code
											dangerouslySetInnerHTML={{
												__html: colorizeJS(line),
											}}
										/>
									</pre>
								))}
							</div>

							<button
								onClick={() =>
									copyToClipboard(runCmd.toString(), "run")
								}
								className="btn btn-sm btn-ghost absolute top-3 right-3"
								aria-label="Copy command"
								type="button"
							>
								<CopyIcon success={copied === "run"} />
							</button>
						</div>

						{/* Output Preview */}
						<div className="mt-4">
							<div className="mockup-code bg-base-100 border border-base-content/10 text-xs md:text-sm">
								<pre>
									<code className="text-red-400">
										🔥 Bahlint v28.58.6934 - Burning your
										code...
									</code>
								</pre>
								<pre>
									<code className="text-warning">
										⚠ 3 problems found
									</code>
								</pre>
								<pre>
									<code className="text-success">
										✓ Auto-fixed 3 problems in 1 file(s)
									<ul>
									<li className="pl-4 text-gray-400"> - index.js</li>
									<li className="pl-4 text-gray-400"> - server.js</li>
									<li className="pl-4 text-gray-400"> - component.js</li>
									</ul>	
									</code>
								</pre>
								<pre>
									<code className="text-base-content/60">
										✓ 1 file scanned in 0.42s
									</code>
								</pre>
							</div>
						</div>
					</div>
				</div>

				{/* Config Example */}
				<div className="mt-8">
					<div className="text-center mb-4">
						<span className="text-sm text-base-content/60">
							Optional: Add a config file
						</span>
					</div>

					<div className="card bg-base-300 border border-base-content/10">
						<div className="card-body p-4">
							<div className="flex items-center gap-2 mb-2">
								<span className="py-2 badge badge-sm badge-ghost">
									bahlint.config.js
								</span>
							</div>

							<div className="mockup-code bg-base-100 border border-base-content/10 text-xs md:text-sm">
								{configLines.map((line, i) => (
									<pre key={i} data-prefix={String(i + 1)}>
										<code
											dangerouslySetInnerHTML={{
												__html: colorizeJS(line),
											}}
										/>
									</pre>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default InstallSection;
