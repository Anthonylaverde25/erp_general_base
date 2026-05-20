import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';

const Root = styled('div')(({ theme }) => ({
	'& > .logo-icon': {
		transition: theme.transitions.create(['width', 'height'], {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	},
	'& > .badge': {
		transition: theme.transitions.create('opacity', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	}
}));

type LogoProps = {
	className?: string;
};

/**
 * The logo component.
 */
function Logo(props: LogoProps) {
	const { className = '' } = props;
	return (
		<Root className={clsx('flex flex-shrink-0 flex-grow items-center gap-3', className)}>
			<div className="flex flex-1 items-center gap-2.5">
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="logo-icon size-8"
				>
					<rect
						width="32"
						height="32"
						rx="6"
						fill="url(#rxna-grad)"
					/>
					<path
						d="M10 22V10H14.5C15.88 10 17 11.12 17 12.5C17 13.88 15.88 15 14.5 15H10"
						stroke="white"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M13.5 15L17.5 22"
						stroke="white"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>
					<path
						d="M21 10L17.5 15L21 20"
						stroke="#00C8FF"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M17.5 10L21 15L17.5 20"
						stroke="#00C8FF"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<defs>
						<linearGradient
							id="rxna-grad"
							x1="0"
							y1="0"
							x2="32"
							y2="32"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#005483" />
							<stop
								offset="1"
								stopColor="#0088CC"
							/>
						</linearGradient>
					</defs>
				</svg>
				<div className="logo-text flex flex-auto flex-col gap-0.5">
					<Typography className="tracking-light text-base leading-none font-bold uppercase">RXNA</Typography>
					<Typography
						className="tracking-tight text-[10px] leading-none font-semibold"
						color="text.secondary"
					>
						Sistema de Gestión
					</Typography>
				</div>
			</div>
			{/* <MainProjectSelection /> */}
		</Root>
	);
}

export default Logo;
