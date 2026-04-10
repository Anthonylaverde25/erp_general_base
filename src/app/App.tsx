import FuseLayout from '@fuse/core/FuseLayout';
import { SnackbarProvider } from 'notistack';
import themeLayouts from 'src/components/theme-layouts/themeLayouts';
import FuseSettingsProvider from '@fuse/core/FuseSettings/FuseSettingsProvider';
import { I18nProvider } from '@i18n/I18nProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale/en-US';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ErrorBoundary from '@fuse/utils/ErrorBoundary';
import Authentication from '@auth/Authentication';
import MainThemeProvider from '../contexts/MainThemeProvider';
import routes from '@/configs/routesConfig';
import AppContext from '@/contexts/AppContext';
import { FuseDialogContextProvider } from '@fuse/core/FuseDialog/contexts/FuseDialogContext/FuseDialogContextProvider';
import { NavbarContextProvider } from '@/components/theme-layouts/components/navbar/contexts/NavbarContext/NavbarContextProvider';
import { QuickPanelProvider } from '@/components/theme-layouts/components/quickPanel/contexts/QuickPanelContext/QuickPanelContextProvider';
import RootThemeProvider from '@/contexts/RootThemeProvider';
import { NavigationContextProvider } from '@/components/theme-layouts/components/navigation/contexts/NavigationContextProvider';
import BroadcastingProvider from '@/providers/BroadcastingProvider';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { Toaster } from 'sonner';

/**
 * The main App component.
 */
function App() {
	const AppContextValue = {
		routes
	};

	return (
		<ErrorBoundary>
			<AppContext value={AppContextValue}>
				{/* Date Picker Localization Provider */}
				<LocalizationProvider
					dateAdapter={AdapterDateFns}
					adapterLocale={enUS}
				>
					<ReactQueryProvider>
						<Authentication>
							<BroadcastingProvider>
								<FuseSettingsProvider>
									<I18nProvider>
										{/* Theme Provider */}
										<RootThemeProvider>
											<MainThemeProvider>
												<NavbarContextProvider>
													<NavigationContextProvider>
														<FuseDialogContextProvider>
															{/* Notistack Notification Provider */}
															<SnackbarProvider
																maxSnack={5}
																anchorOrigin={{
																	vertical: 'bottom',
																	horizontal: 'right'
																}}
																classes={{
																	containerRoot:
																		'bottom-0 right-0 mb-13 md:mb-17 mr-2 lg:mr-20 z-99'
																}}
															>
																<QuickPanelProvider>
																	<FuseLayout layouts={themeLayouts} />
																</QuickPanelProvider>
															</SnackbarProvider>
														</FuseDialogContextProvider>
													</NavigationContextProvider>
												</NavbarContextProvider>
												<Toaster
													richColors
													position="bottom-right"
												/>
											</MainThemeProvider>
										</RootThemeProvider>
									</I18nProvider>
								</FuseSettingsProvider>
							</BroadcastingProvider>
						</Authentication>
					</ReactQueryProvider>
				</LocalizationProvider>
			</AppContext>
		</ErrorBoundary>
	);
}

export default App;
