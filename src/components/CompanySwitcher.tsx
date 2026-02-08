import { useState, useCallback } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    Typography,
    ListItemText,
    ListItemIcon,
    Divider,
    CircularProgress
} from '@mui/material';
import { ICompany } from '@/types/company.types';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useAuth from '@fuse/core/FuseAuthProvider/useAuth';
import useChangeCompany from '@/features/companies/hooks/useChangeCompany';
import useActiveCompany from '@/features/companies/useActiveCompany';

function CompanySwitcher() {
    // Read available companies from Auth Context (Source of Truth for "What companies can I access?")
    const { authState: { user: { companies } = {} } = {} } = useAuth();

    // Read Active Company from our React Query Hook (Source of Truth for "Where am I?")
    const activeCompany = useActiveCompany();
    const { changeCompanyAsync, isLoading } = useChangeCompany();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isOpen = Boolean(anchorEl);

    // Derived state directly from the hook, no useEffect needed
    const activeCompanyName = activeCompany?.name ?? 'Seleccionar empresa';
    const selectedCompanyId = activeCompany?.id ?? null;

    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleSelectCompany = useCallback(
        (companyId: ICompany['id']) => {
            if (companyId === selectedCompanyId) {
                handleCloseMenu();
                return;
            }

            changeCompanyAsync(companyId);
            handleCloseMenu();
        },
        [selectedCompanyId, handleCloseMenu, changeCompanyAsync]
    );

    const handleManageCompanies = useCallback(() => {
        // Future implementation: Navigate to company management
        handleCloseMenu();
    }, [handleCloseMenu]);

    return (
        <>
            <Button
                color="inherit"
                disabled={isLoading}
                aria-controls={isOpen ? 'company-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isOpen ? 'true' : undefined}
                onClick={handleOpenMenu}
                className="flex h-10 w-full items-center justify-start rounded-md px-4 md:w-auto"
                sx={{
                    minWidth: 'auto',
                    maxWidth: 320,
                    textTransform: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'action.hover',
                    '&:hover': { backgroundColor: 'action.selected' }
                }}
            >
                <div className="mx-4 flex flex-1 flex-col items-start overflow-hidden">
                    <Typography
                        component="span"
                        className="text-13 font-medium leading-none truncate w-full"
                        sx={{ textAlign: 'left' }}
                    >
                        {activeCompanyName}
                    </Typography>
                </div>

                {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                ) : (
                    <FuseSvgIcon size={16} color="action">
                        heroicons-outline:chevron-down
                    </FuseSvgIcon>
                )}
            </Button>

            <Menu
                id="company-menu"
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleCloseMenu}
                className="mt-4"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                    style: {
                        minWidth: anchorEl?.clientWidth,
                        width: 'auto'
                    }
                }}
            >
                {companies?.length ? (
                    companies.map((company) => {
                        const isSelected = company.id === selectedCompanyId;

                        return (
                            <MenuItem
                                key={company.id}
                                onClick={() => handleSelectCompany(company.id)}
                                selected={isSelected}
                                disableRipple
                            >
                                <ListItemText
                                    primary={company.name}
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                />

                                {isSelected && (
                                    <ListItemIcon className="min-w-0">
                                        <FuseSvgIcon size={20} className="text-green-600">
                                            heroicons-outline:check
                                        </FuseSvgIcon>
                                    </ListItemIcon>
                                )}
                            </MenuItem>
                        );
                    })
                ) : (
                    <MenuItem disabled>
                        <ListItemText
                            primary="No hay empresas disponibles"
                            primaryTypographyProps={{ variant: 'body2' }}
                        />
                    </MenuItem>
                )}

                <Divider />

                <MenuItem onClick={handleManageCompanies}>
                    <ListItemText
                        primary="Gestionar empresas"
                        primaryTypographyProps={{ variant: 'body2' }}
                    />
                </MenuItem>
            </Menu>
        </>
    );
}

export default CompanySwitcher;
