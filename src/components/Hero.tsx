import { FC, useState } from "react";
import FlameIcon, { FlameStatic } from "./FlameIcon";

const Hero: FC = () => {
	const [copied, setCopied] = useState(false);
	const installCommand = "npx bahlint@latest . --fix";
	const copyToClipboard = () => {
		navigator.clipboard.writeText(installCommand);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<section className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0 gradient-dark" />
			<div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
			<div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
			<div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px]" />

			<div className="relative z-10 text-center max-w-2xl mx-auto">
				{/* Badge */}
				<div
					className="animate-float-up"
					style={{ animationDelay: "0.1s" }}
				>
					<span className="badge badge-primary badge-outline gap-2 px-4 py-3 mb-[2px]">
						Forked from ESLint
					</span>
				</div>

				{/* Logo */}
				<div
					className="animate-float-up flex justify-center mb-6"
					style={{ animationDelay: "0.2s" }}
				>
					<div className="relative">
						<div className="animate-burn-glow rounded-full p-6 bg-base-200">
							<FlameIcon size={80} />
						</div>
					</div>
				</div>

				{/* Title */}
				<h1
					className="animate-float-up text-5xl md:text-7xl font-black mb-4"
					style={{ animationDelay: "0.3s" }}
				>
					<span className="text-gradient-fire">Bahlint</span>
				</h1>

				{/* Tagline */}
				<p
					className="animate-float-up text-xl md:text-2xl text-base-content/80 mb-8 max-w-md mx-auto"
					style={{ animationDelay: "0.4s" }}
				>
					🔥 Burn your code to fix it quick as{" "}
					<span className="text-primary font-bold animate-pulse">
						gasoline
					</span>{" "}
					while burning
				</p>

				{/* Quick Install Command */}
				<div
					className="animate-float-up mb-8"
					style={{ animationDelay: "0.55s" }}
				>
					<div className="divider text-sm text-base-content/40">
						Quick Run & Fix
					</div>
					<div
						onClick={copyToClipboard}
						className="inline-flex items-center gap-3 bg-base-200 hover:bg-base-300 border border-base-content/10 rounded-xl px-5 py-3 cursor-pointer transition-all duration-200 group hover:border-primary/30"
					>
						<span className="text-primary font-mono text-sm">
							$
						</span>
						<code className="font-mono text-sm md:text-base text-base-content">
							{installCommand}
						</code>
						<button
							className="btn btn-ghost btn-sm btn-square"
							aria-label="Copy command"
						>
							{copied ? (
								<svg
									className="w-4 h-4 text-success"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
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
									className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
									/>
								</svg>
							)}
						</button>
					</div>
					{copied && (
						<p className="text-xs text-success mt-2 animate-fade-in">
							Copied to clipboard!
						</p>
					)}
				</div>

				{/* CTA Buttons */}
				<div
					className="animate-float-up flex flex-col sm:flex-row gap-3 justify-center"
					style={{ animationDelay: "0.6s" }}
				>
					<a href="#install" className="btn btn-primary btn-lg gap-2">
						<FlameStatic /> Quick Start
					</a>
					<a
						href="https://github.com/bahlint/bahlint"
						target="_blank"
						rel="noopener noreferrer"
						className="btn btn-outline btn-lg"
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
						</svg>
						GitHub
					</a>
				</div>
			</div>
		</section>
	);
};

export default Hero;
