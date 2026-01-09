import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import FlameIcon from "../components/FlameIcon";

const NotFound = () => {
	const location = useLocation();

	useEffect(() => {
		console.error(
			"404 Error: User attempted to access non-existent route:",
			location.pathname,
		);
	}, [location.pathname]);

	return (
		<section className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
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
			<div className="text-center absolute left-1/2 transform -translate-x-1/2">
				<h1 className="mb-44 text-7xl font-black">404</h1>
				<p className="mb-4 text-xl">
					Uh-oh, looks like you’re out of gas.
				</p>
				<a
					href="/"
					className="text-primary underline hover:text-primary/90"
				>
					Return to Home
				</a>
			</div>
		</section>
	);
};

export default NotFound;
