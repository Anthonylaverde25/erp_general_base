import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router';

type QuickPanelToggleButtonProps = {
	className?: string;
	children?: React.ReactNode;
};

/**
 * The quick panel toggle button.
 */
function QuickPanelToggleButton(props: QuickPanelToggleButtonProps) {
	const { className = '', children = <FuseSvgIcon>lucide:settings</FuseSvgIcon> } = props;

	return (
		<IconButton
			component={Link}
			to="/apps/settings"
			className={className}
		>
			{children}
		</IconButton>
	);
}

export default QuickPanelToggleButton;
