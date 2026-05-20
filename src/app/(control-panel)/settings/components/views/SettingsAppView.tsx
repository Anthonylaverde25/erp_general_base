'use client';

import { useEffect, useState } from 'react';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageSimple from '@fuse/core/FusePageSimple';
import usePathname from '@fuse/hooks/usePathname';
import SettingsAppSidebarContent from '../ui/SettingsAppSidebarContent';
import SettingsAppHeader from '../ui/SettingsAppHeader';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.vars.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.vars.palette.divider,
	},
	'& .FusePageSimple-content': {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 1 auto',
		padding: 0,
		backgroundColor: theme.vars.palette.background.default,
	},
	'& .FusePageSimple-sidebarWrapper': {
		borderRightWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.vars.palette.divider,
	},
	'& .FusePageSimple-sidebarContent': {
		backgroundColor: theme.vars.palette.background.paper,
	}
}));

type SettingsAppProps = {
	children?: React.ReactNode;
};

function SettingsAppView(props: SettingsAppProps) {
	const { children } = props;
	const pathname = usePathname();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	useEffect(() => {
		if (isMobile) {
			setLeftSidebarOpen(false);
		}
	}, [pathname, isMobile]);

	return (
		<Root
			header={
				<SettingsAppHeader
					onSetSidebarOpen={setLeftSidebarOpen}
				/>
			}
			content={
				<Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default', p: 3 }}>
					{children}
				</Box>
			}
			leftSidebarProps={{
				open: leftSidebarOpen,
				onClose: () => {
					setLeftSidebarOpen(false);
				},
				content: <SettingsAppSidebarContent onSetSidebarOpen={setLeftSidebarOpen} />,
				width: 320
			}}
			scroll="content"
		/>
	);
}

export default SettingsAppView;
