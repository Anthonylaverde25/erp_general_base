import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router';
import useUser from '@auth/useUser';

type QuickPanelToggleButtonProps = {
	className?: string;
	children?: React.ReactNode;
};

/**
 * The quick panel toggle button.
 */
function QuickPanelToggleButton(props: QuickPanelToggleButtonProps) {
	const { className = '', children = <FuseSvgIcon>lucide:settings</FuseSvgIcon> } = props;
	const { hasPermission } = useUser();

	const canAccessSettings = hasPermission('settings.general.manage') ||
		hasPermission('settings.team.manage') ||
		hasPermission('settings.roles.manage');

	if (!canAccessSettings) {
		return null;
	}

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
