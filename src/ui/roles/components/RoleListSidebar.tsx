import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Button,
    TextField,
    InputAdornment,
    useTheme,
    alpha,
    Chip,
    Paper,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { RoleType } from "@/types/role.types";
import { useState } from "react";

interface RoleListSidebarProps {
    roles: RoleType[];
    selectedRoleId: RoleType["id"] | null;
    onSelectRole: (roleId: RoleType["id"]) => void;
    onCreateRole: () => void;
}

export default function RoleListSidebar({
    roles,
    selectedRoleId,
    onSelectRole,
    onCreateRole,
}: RoleListSidebarProps) {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRoles = roles.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Paper
            className="flex flex-col h-full overflow-hidden border-r shrink-0"
            elevation={0}
            sx={{
                width: 320,
                borderRadius: 0,
                bgcolor: theme.palette.background.default
            }}
        >
            {/* Header */}
            <Box className="p-4 border-b" sx={{ bgcolor: 'background.paper' }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
                    onClick={onCreateRole}
                    sx={{ mb: 2.5 }}
                >
                    Crear Nuevo Rol
                </Button>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FuseSvgIcon size={18} color="action">heroicons-outline:magnifying-glass</FuseSvgIcon>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Role List */}
            <List className="flex-1 overflow-y-auto p-3 space-y-1">
                {filteredRoles.map((role) => (
                    <ListItem key={role.id} disablePadding>
                        <ListItemButton
                            selected={selectedRoleId === role.id}
                            onClick={() => onSelectRole(role.id)}
                            sx={{
                                borderRadius: 1.5,
                                mb: 0.5,
                                py: 1.5,
                                px: 2,
                                transition: 'all 0.2s ease',
                                '&.Mui-selected': {
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                                    color: 'primary.main',
                                    borderLeft: (theme) => `3px solid ${theme.palette.primary.main}`,
                                    '&:hover': {
                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.18),
                                    },
                                    '& .MuiTypography-root': {
                                        fontWeight: 600,
                                    }
                                },
                                '&:hover': {
                                    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.4),
                                }
                            }}
                        >
                            <ListItemText
                                primary={role.name}
                                secondary={
                                    <Typography
                                        variant="caption"
                                        component="span"
                                        sx={{
                                            fontFamily: 'monospace',
                                            opacity: 0.7,
                                            display: 'block',
                                            mt: 0.5
                                        }}
                                    >
                                        {role.code}
                                    </Typography>
                                }
                                primaryTypographyProps={{
                                    variant: 'body2',
                                    fontWeight: selectedRoleId === role.id ? 600 : 500
                                }}
                            />
                            <FuseSvgIcon size={18} color={selectedRoleId === role.id ? "primary" : "action"}>
                                heroicons-outline:chevron-right
                            </FuseSvgIcon>
                        </ListItemButton>
                    </ListItem>
                ))}

                {filteredRoles.length === 0 && (
                    <Box className="p-4 text-center">
                        <Typography variant="body2" color="text.secondary">
                            No se encontraron roles
                        </Typography>
                    </Box>
                )}
            </List>
        </Paper>
    );
}
