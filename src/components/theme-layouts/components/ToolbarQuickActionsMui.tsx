import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import { Divider, ListItemIcon, ListItemText } from '@mui/material';

export function QuickActionsButtonMui() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        handleClose();
    };

    return (
        <>
            <IconButton
                className="h-10 w-10 shrink-0 mx-1 cursor-pointer"
                aria-controls="quick-actions-menu"
                aria-haspopup="true"
                onClick={handleClick}
                aria-label="Acciones Rápidas (MUI)"
            >
                <FuseSvgIcon>lucide:plus</FuseSvgIcon>
            </IconButton>
            <Menu
                id="quick-actions-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                slotProps={{
                    paper: {
                        sx: { width: 224 }
                    }
                }}
            >
                <Typography className="px-4 py-2 text-sm font-semibold">Crear Nuevo</Typography>
                <Divider className="my-1" />

                <MenuItem onClick={() => handleNavigate('/partners/create')}>
                    <ListItemIcon>
                        <FuseSvgIcon size={16}>lucide:user-plus</FuseSvgIcon>
                    </ListItemIcon>
                    <ListItemText primary="Nuevo Cliente" />
                    <Typography variant="body2" color="text.secondary">
                        ⌘C
                    </Typography>
                </MenuItem>

                <MenuItem onClick={() => handleNavigate('/partners/create')}>
                    <ListItemIcon>
                        <FuseSvgIcon size={16}>lucide:truck</FuseSvgIcon>
                    </ListItemIcon>
                    <ListItemText primary="Nuevo Proveedor" />
                    <Typography variant="body2" color="text.secondary">
                        ⌘P
                    </Typography>
                </MenuItem>

                <Divider className="my-1" />

                <MenuItem onClick={() => handleNavigate('/items/create?type=service')}>
                    <ListItemIcon>
                        <FuseSvgIcon size={16}>lucide:briefcase</FuseSvgIcon>
                    </ListItemIcon>
                    <ListItemText primary="Nuevo Servicio" />
                    <Typography variant="body2" color="text.secondary">
                        ⇧⌘S
                    </Typography>
                </MenuItem>

                <MenuItem onClick={() => handleNavigate('/items/create?type=physical')}>
                    <ListItemIcon>
                        <FuseSvgIcon size={16}>lucide:package</FuseSvgIcon>
                    </ListItemIcon>
                    <ListItemText primary="Nuevo Artículo" />
                    <Typography variant="body2" color="text.secondary">
                        ⇧⌘A
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    );
}
