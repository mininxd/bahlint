import { FC } from "react";

interface FlameIconProps {
	className?: string;
	size?: number;
}

const FlameIcon: FC<FlameIconProps> = ({ className = "", size = 24 }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`animate-flame ${className}`}
		>
			<defs>
				<linearGradient
					id="flameGradient"
					x1="0%"
					y1="100%"
					x2="0%"
					y2="0%"
				>
					<stop offset="0%" stopColor="#ED1C24" />
					<stop offset="50%" stopColor="#f97316" />
					<stop offset="100%" stopColor="#fbbf24" />
				</linearGradient>
			</defs>
			<path
				d="M12 2C8.5 6 4 9.5 4 14C4 18.5 7.5 22 12 22C16.5 22 20 18.5 20 14C20 9.5 15.5 6 12 2Z"
				fill="url(#flameGradient)"
			/>
			<path
				d="M12 6C10 8.5 8 10.5 8 13C8 16 9.5 18 12 18C14.5 18 16 16 16 13C16 10.5 14 8.5 12 6Z"
				fill="#fbbf24"
				opacity="0.9"
			/>
			<path
				d="M12 10C11 11.5 10 12.5 10 14C10 15.5 10.75 17 12 17C13.25 17 14 15.5 14 14C14 12.5 13 11.5 12 10Z"
				fill="#fef3c7"
				opacity="0.85"
			/>
		</svg>
	);
};

const FlameStatic: FC<FlameIconProps> = ({ size = 24 }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<linearGradient
					id="flameGradient"
					x1="0%"
					y1="100%"
					x2="0%"
					y2="0%"
				>
					<stop offset="0%" stopColor="#ED1C24" />
					<stop offset="50%" stopColor="#f97316" />
					<stop offset="100%" stopColor="#fbbf24" />
				</linearGradient>
			</defs>
			<path
				d="M12 2C8.5 6 4 9.5 4 14C4 18.5 7.5 22 12 22C16.5 22 20 18.5 20 14C20 9.5 15.5 6 12 2Z"
				fill="url(#flameGradient)"
			/>
			<path
				d="M12 6C10 8.5 8 10.5 8 13C8 16 9.5 18 12 18C14.5 18 16 16 16 13C16 10.5 14 8.5 12 6Z"
				fill="#fbbf24"
				opacity="0.9"
			/>
			<path
				d="M12 10C11 11.5 10 12.5 10 14C10 15.5 10.75 17 12 17C13.25 17 14 15.5 14 14C14 12.5 13 11.5 12 10Z"
				fill="#fef3c7"
				opacity="0.85"
			/>
		</svg>
	);
};

export { FlameStatic };
export default FlameIcon;
