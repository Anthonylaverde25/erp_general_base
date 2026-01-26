import { useState } from 'react';
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
import useIndexCompanies from '@/features/companies/hooks/useIndexCompanies';

// Hardcoded companies (static demo data)
const HARDCODED_COMPANIES: Company[] = [
    { id: 1, name: 'Company Alpha', address: '123 Alpha St', website: 'alpha.com' },
    { id: 2, name: 'Beta Corp', address: '456 Beta Blvd', website: 'beta.com' },
    { id: 3, name: 'Gamma Ltd', address: '789 Gamma Rd', website: 'gamma.com' }
];

function CompanySwitcher() {
    const { companies, isLoading, isError, error } = useIndexCompanies()
    console.log('companies', companies)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Default selected company = first one
    const [selectedCompany, setSelectedCompany] = useState<Company>(
        HARDCODED_COMPANIES[0]
    );

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (company: Company) => {
        setSelectedCompany(company);
        handleClose();
    };

    const handleManageCompanies = () => {
        // ToDo: Navigate to companies management
        console.log('Navigate to Manage Companies');
        handleClose();
    };


    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error: {error?.message}</div>
    }

    return (
        <>
            <Button
                color="inherit"
                aria-controls="company-menu"
                aria-haspopup="true"
                onClick={handleClick}
                className="flex h-10 w-full items-center justify-start rounded-md px-4 md:w-auto"
                sx={{
                    minWidth: 'auto',
                    maxWidth: 320, // Optional max width constraint
                    textTransform: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                        backgroundColor: 'action.hover'
                    }
                }}
            >
                <div className="mx-4 flex flex-1 flex-col items-start overflow-hidden">
                    <Typography
                        component="span"
                        className="text-13 font-medium leading-none truncate w-full"
                        sx={{ textAlign: 'left' }}
                    >
                        {selectedCompany.name}
                    </Typography>
                </div>

                <FuseSvgIcon size={16} color="action">
                    heroicons-outline:chevron-down
                </FuseSvgIcon>
            </Button>

            <Menu
                id="company-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className="mt-4"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
                PaperProps={{
                    style: {
                        minWidth: anchorEl ? anchorEl.clientWidth : undefined,
                        width: 'auto'
                    }
                }}
            >
                {companies?.map((company) => (
                    <MenuItem
                        key={company.id}
                        onClick={() => handleSelect(company)}
                        selected={company.id === selectedCompany.id}
                        disableRipple
                    >
                        <ListItemText
                            primary={company.name}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                        />

                        {company.id === selectedCompany.id && (
                            <ListItemIcon className="min-w-0">
                                <FuseSvgIcon size={20} className="text-green-600">
                                    heroicons-outline:check
                                </FuseSvgIcon>
                            </ListItemIcon>
                        )}
                    </MenuItem>
                ))}

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
