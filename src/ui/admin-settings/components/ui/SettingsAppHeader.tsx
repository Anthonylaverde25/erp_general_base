import find from 'lodash/find';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import usePathname from '@fuse/hooks/usePathname';
import SettingsAppNavigation from '../../lib/constants/SettingsAppNavigation';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import PageHeader from '@/components/PageHeader';
import { Box } from '@mui/material';

type SettingsAppHeaderProps = {
	className?: string;
	onSetSidebarOpen: (open: boolean) => void;
};

function SettingsAppHeader(props: SettingsAppHeaderProps) {
	const { className, onSetSidebarOpen } = props;
	const pathname = usePathname();
	const currentNavigation = find(SettingsAppNavigation.children, { url: pathname });
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const titleNode = isMobile ? (
		<Box className="flex items-center gap-2">
			<IconButton
				className="border-divider border"
				onClick={() => onSetSidebarOpen(true)}
				aria-label="open left sidebar"
				sx={{ borderRadius: '4px' }}
			>
				<FuseSvgIcon>lucide:menu</FuseSvgIcon>
			</IconButton>
			<span>{currentNavigation?.title || ''}</span>
		</Box>
	) : (
		currentNavigation?.title || ''
	);

	return (
		<PageHeader
			title={titleNode}
			subtitle={currentNavigation?.subtitle}
			className={className}
		/>
	);
}

export default SettingsAppHeader;
