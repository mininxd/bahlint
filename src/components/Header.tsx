import { FC, useState } from "react";
import FlameIcon from "./FlameIcon";

const Header: FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 glass-dark">
			<div className="navbar px-4 py-3 max-w-5xl mx-auto">
				<div className="navbar-start">
					<a href="/" className="flex items-center gap-2 group">
						<FlameIcon size={32} />
						<span className="text-xl font-bold text-gradient-fire group-hover:opacity-80 transition-opacity">
							Bahlint
						</span>
					</a>
				</div>
			</div>
		</header>
	);
};

export default Header;
