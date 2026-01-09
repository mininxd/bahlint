import { FC } from "react";
import FlameIcon from "./FlameIcon";

const Footer: FC = () => {
	return (
		<footer className="py-12 px-4 border-t border-base-content/10">
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					{/* Brand */}
					<div className="flex items-center gap-3">
						<FlameIcon size={28} />
						<div>
							<span className="text-lg font-bold text-gradient-fire">
								Bahlint
							</span>
							<p className="text-xs text-base-content/40">
								Burn problems, not your code
							</p>
						</div>
					</div>

					{/* Links */}
					<div className="flex flex-wrap justify-center gap-4 text-sm">
						<a
							href="https://github.com/bahlint/bahlint"
							target="_blank"
							rel="noopener noreferrer"
							className="link link-hover text-base-content/60 hover:text-primary"
						>
							GitHub
						</a>
						<a
							href="https://github.com/bahlint/bahlint/issues"
							target="_blank"
							rel="noopener noreferrer"
							className="link link-hover text-base-content/60 hover:text-primary"
						>
							Issues
						</a>
						<a
							href="https://github.com/bahlint/bahlint#readme"
							target="_blank"
							rel="noopener noreferrer"
							className="link link-hover text-base-content/60 hover:text-primary"
						>
							Documentation
						</a>
					</div>

					{/* Pertamina Colors Indicator */}
					<div className="flex items-center gap-2">
						<div
							className="w-3 h-3 rounded-full bg-primary"
							title="Red"
						/>
						<div
							className="w-3 h-3 rounded-full bg-secondary"
							title="Green"
						/>
						<div
							className="w-3 h-3 rounded-full bg-accent"
							title="Blue"
						/>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 text-center">
					<p className="text-xs text-base-content/40">
						© {new Date().getFullYear()} Bahlint. Forked from ESLint
						with 🔥
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
