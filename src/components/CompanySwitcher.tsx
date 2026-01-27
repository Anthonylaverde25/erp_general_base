import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    Typography,
    ListItemText,
    ListItemIcon,
    Divider
} from '@mui/material';
import { Company } from '@/types/company.types';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useAuth from '@fuse/core/FuseAuthProvider/useAuth';
import useChangeCompany from '@/features/companies/hooks/useChangeCompany';
import useActiveCompany from '@/features/companies/useActiveCompany';

function CompanySwitcher() {
    const { authState: { user: { active_company, companies } = {} } = {} } = useAuth();
    const { id, name } = useActiveCompany()
    const { changeCompanyAsync } = useChangeCompany()

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedCompanyId, setSelectedCompanyId] = useState<Company['id'] | null>(
        active_company?.id ?? null
    );

    /**
     * Sincroniza estado local con backend/session
     */
    useEffect(() => {
        if (active_company?.id && active_company.id !== selectedCompanyId) {
            setSelectedCompanyId(active_company.id);
        }
    }, [active_company?.id, selectedCompanyId]);

    const isOpen = Boolean(anchorEl);

    const activeCompanyName = useMemo(
        () => active_company?.name ?? 'Seleccionar empresa',
        [active_company?.name]
    );

    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleSelectCompany = useCallback(
        (companyId: Company['id']) => {
            if (companyId === selectedCompanyId) {
                handleCloseMenu();
                return;
            }

            setSelectedCompanyId(companyId);
            changeCompanyAsync(companyId);

            // TODO: acción real de cambio de empresa
            // switchCompany(companyId);

            handleCloseMenu();
        },
        [selectedCompanyId, handleCloseMenu]
    );

    const handleManageCompanies = useCallback(() => {
        // TODO: navegar a gestión de empresas
        // navigate('/companies');
        handleCloseMenu();
    }, [handleCloseMenu]);


    console.log('empresa activa desde el auth', active_company)
    console.log('empresa activa desde el hook', id, name)

    return (
        <>
            <Button
                color="inherit"
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

                <FuseSvgIcon size={16} color="action">
                    heroicons-outline:chevron-down
                </FuseSvgIcon>
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
