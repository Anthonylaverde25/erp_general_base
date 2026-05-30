import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo } from 'react';
import NavbarToggleButton from 'src/components/theme-layouts/components/navbar/NavbarToggleButton';
import themeOptions from 'src/configs/themeOptions';
import find from 'lodash/find';
import LightDarkModeToggle from 'src/components/LightDarkModeToggle';
import useFuseLayoutSettings from '@fuse/core/FuseLayout/useFuseLayoutSettings';
import FullScreenToggle from '../../components/FullScreenToggle';
import NavigationShortcuts from '../../components/navigation/NavigationShortcuts';
import QuickPanelToggleButton from '../../components/quickPanel/QuickPanelToggleButton';
import { Layout1ConfigDefaultsType } from '@/components/theme-layouts/layout1/Layout1Config';
import useThemeMediaQuery from '../../../../@fuse/hooks/useThemeMediaQuery';
import { AppBar, Divider } from '@mui/material';
import { Theme } from '@mui/material/styles';
import ToolbarTheme from 'src/contexts/ToolbarTheme';
import CompanySwitcher from '@/components/CompanySwitcher';
import AppLauncher from '@/components/app-launcher';
import { QuickActionsButtonMui as ToolbarQuickActionsMui } from '../../components/ToolbarQuickActionsMui';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import CompanyLogoHeader from '@/components/CompanyLogoHeader';


type ToolbarLayout1Props = {
	className?: string;
};

/**
 * The toolbar layout 1.
 */
function ToolbarLayout1(props: ToolbarLayout1Props) {
	const { className } = props;

	const settings = useFuseLayoutSettings();
	const config = settings.config as Layout1ConfigDefaultsType;
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		<ToolbarTheme>
			<AppBar
				id="fuse-toolbar"
				className={clsx('relative z-20 flex', className)}
				sx={(theme: Theme) => ({
					backgroundColor: theme.vars.palette.background.default,
					color: theme.vars.palette.text.primary,
					boxShadow: 'none',
					borderBottom: `1px solid ${theme.vars.palette.divider}`,
					...theme.applyStyles('light', {
						backgroundColor: '#303952 !important',
						color: '#ffffff !important',
						borderBottom: '1px solid rgba(255, 255, 255, 0.1) !important',
						'& .MuiSvgIcon-root, & .MuiIconButton-root': {
							color: '#ffffff !important',
						},
						'& .MuiButton-root': {
							color: '#ffffff !important',
							borderColor: 'rgba(255, 255, 255, 0.15) !important',
							backgroundColor: 'rgba(255, 255, 255, 0.08) !important',
							'&:hover': {
								backgroundColor: 'rgba(255, 255, 255, 0.15) !important',
							},
							'& .MuiSvgIcon-root': {
								color: '#ffffff !important',
							}
						},
						'& .MuiTypography-root': {
							color: '#ffffff !important',
						},
						'& .MuiDivider-root': {
							borderColor: 'rgba(255, 255, 255, 0.15) !important',
						},
						'& .fuse-list-item-icon, & .arrow-icon': {
							color: '#ffffff !important',
						}
					})
				})}
			>
				<Toolbar className="min-h-12 p-0 md:min-h-16">
					<div className="flex flex-1 items-center gap-3 px-2 md:px-4">
						{config.navbar.display && config.navbar.position === 'left' && (
							<>
								<NavbarToggleButton />

								<Divider
									orientation="vertical"
									flexItem
									variant="middle"
								/>
							</>
						)}

						<CompanyLogoHeader />

						{!isMobile && <NavigationShortcuts />}
						{!isMobile && <FullScreenToggle />}
					</div>

					<div className="flex items-center overflow-x-auto px-2 py-2 md:px-4 gap-2.5">
						<AppLauncher />
						<ToolbarQuickActionsMui />
						<CompanySwitcher />
						<LanguageSwitcher />
						{/* <AdjustFontSize /> */}
						<LightDarkModeToggle
							lightTheme={find(themeOptions, { id: 'Default' })}
							darkTheme={find(themeOptions, { id: 'Default Dark' })}
						/>
						{/* <NavigationSearch /> */}
						<QuickPanelToggleButton />
					</div>

					{config.navbar.display && config.navbar.position === 'right' && (
						<>
							{!isMobile && (
								<>
									<Divider
										orientation="vertical"
										flexItem
										variant="middle"
									/>
									<NavbarToggleButton />
								</>
							)}

							{isMobile && <NavbarToggleButton className="h-10 w-10 p-0 sm:mx-2" />}
						</>
					)}
				</Toolbar>
			</AppBar>
		</ToolbarTheme>
	);
}

export default memo(ToolbarLayout1);
