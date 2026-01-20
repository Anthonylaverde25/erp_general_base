import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { UserType } from '@/types/user.types';

interface UserActionMenuProps {
    row: any;
    onEdit: () => void;
}

export default function UserActionMenu({ row, onEdit }: UserActionMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="small"
                sx={{
                    padding: '4px',
                    '&:hover': {
                        backgroundColor: 'action.hover'
                    }
                }}
            >
                <FuseSvgIcon size={16}>heroicons-outline:ellipsis-horizontal</FuseSvgIcon>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                onClick={(e) => e.stopPropagation()}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    elevation: 2,
                    sx: {
                        minWidth: 140,
                        mt: 0.5,
                        borderRadius: 1,
                        '& .MuiMenuItem-root': {
                            px: 1.5,
                            py: 0.75,
                            fontSize: '0.8125rem',
                            gap: 1,
                            '& .MuiListItemIcon-root': {
                                minWidth: 'auto',
                                color: 'text.secondary'
                            }
                        }
                    }
                }}
            >
                <MenuItem
                    onClick={(e) => {
                        handleClose(e);
                        console.log('Ver:', row.original.id);
                    }}
                >
                    <ListItemIcon>
                        <FuseSvgIcon size={16}>heroicons-outline:eye</FuseSvgIcon>
                    </ListItemIcon>
                    Ver detalles
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        handleClose(e);
                        onEdit();
                    }}
                >
                    <ListItemIcon>
                        <FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>
                    </ListItemIcon>
                    Editar
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        handleClose(e);
                        console.log('Eliminar:', row.original.id);
                    }}
                    sx={{ color: 'error.main', '& .MuiListItemIcon-root': { color: 'error.main !important' } }}
                >
                    <ListItemIcon>
                        <FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
                    </ListItemIcon>
                    Eliminar
                </MenuItem>
            </Menu>
        </>
    );
}
