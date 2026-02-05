import React, { useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Switch,
    Chip,
    Stack,
    Tooltip,
    useTheme,
    alpha,
    Divider,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

// Mock types
type PermissionType = "read" | "write" | "delete";

interface ResourcePermission {
    resourceId: string;
    resourceName: string;
    permissions: {
        read: boolean;
        write: boolean;
        delete: boolean;
    };
}

// Mock Data
const INITIAL_PERMISSIONS: ResourcePermission[] = [
    {
        resourceId: "users",
        resourceName: "Usuarios",
        permissions: { read: true, write: false, delete: false },
    },
    {
        resourceId: "roles",
        resourceName: "Roles y Permisos",
        permissions: { read: true, write: true, delete: false },
    },
    {
        resourceId: "invoices",
        resourceName: "Facturas",
        permissions: { read: true, write: true, delete: true },
    },
    {
        resourceId: "products",
        resourceName: "Productos",
        permissions: { read: true, write: false, delete: false },
    },
    {
        resourceId: "settings",
        resourceName: "Configuración",
        permissions: { read: false, write: false, delete: false },
    },
];

export default function RolePermissionMatrix() {
    const theme = useTheme();
    const [permissions, setPermissions] = useState<ResourcePermission[]>(INITIAL_PERMISSIONS);

    const handleToggle = (resourceId: string, type: PermissionType) => {
        setPermissions((prev) =>
            prev.map((res) => {
                if (res.resourceId === resourceId) {
                    return {
                        ...res,
                        permissions: {
                            ...res.permissions,
                            [type]: !res.permissions[type],
                        },
                    };
                }
                return res;
            })
        );
    };

    const getOctalCode = (p: { read: boolean; write: boolean; delete: boolean }) => {
        let score = 0;
        if (p.read) score += 4;
        if (p.write) score += 2;
        if (p.delete) score += 1;
        return score;
    };

    const getBadges = (p: { read: boolean; write: boolean; delete: boolean }) => {
        return (
            <Stack direction="row" spacing={0.5} className="font-mono text-xs">
                <span style={{ color: p.read ? theme.palette.success.main : theme.palette.text.disabled }}>r</span>
                <span style={{ color: p.write ? theme.palette.warning.main : theme.palette.text.disabled }}>w</span>
                <span style={{ color: p.delete ? theme.palette.error.main : theme.palette.text.disabled }}>x</span>
            </Stack>
        );
    };

    return (
        <Box className="w-full">
            <Box sx={{
                p: 3,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                borderBottom: `2px solid`,
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.2)
            }}>
                <Typography variant="h6" fontWeight={700}>
                    Matriz de Acceso
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Configure los permisos de nivel de sistema (rwx style)
                </Typography>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.15),
                            borderBottom: (theme) => `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}>
                            <TableCell sx={{ fontWeight: 700, pl: 3 }}>Recurso</TableCell>
                            <TableCell align="center" width="120" sx={{ fontWeight: 700 }}>Lectura (r)</TableCell>
                            <TableCell align="center" width="120" sx={{ fontWeight: 700 }}>Escritura (w)</TableCell>
                            <TableCell align="center" width="120" sx={{ fontWeight: 700 }}>Eliminar (x)</TableCell>
                            <TableCell align="center" width="100" sx={{ fontWeight: 700 }}>Estado</TableCell>
                            <TableCell align="right" width="100" sx={{ fontWeight: 700, pr: 3 }}>Octal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {permissions.map((resource, index) => (
                            <TableRow
                                key={resource.resourceId}
                                hover
                                sx={{
                                    transition: "all 0.2s ease",
                                    "&:last-child td": { borderBottom: 0 },
                                    "&:nth-of-type(odd)": {
                                        backgroundColor: (theme) => alpha(theme.palette.action.hover, 0.4),
                                    },
                                    "&:nth-of-type(even)": {
                                        backgroundColor: "transparent",
                                    },
                                    "&:hover": {
                                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                    },
                                }}
                            >
                                <TableCell sx={{ pl: 3 }}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {resource.resourceName}
                                    </Typography>
                                </TableCell>

                                {/* Read */}
                                <TableCell align="center">
                                    <Switch
                                        size="small"
                                        checked={resource.permissions.read}
                                        onChange={() => handleToggle(resource.resourceId, "read")}
                                        color="success"
                                    />
                                </TableCell>

                                {/* Write */}
                                <TableCell align="center">
                                    <Switch
                                        size="small"
                                        checked={resource.permissions.write}
                                        onChange={() => handleToggle(resource.resourceId, "write")}
                                        color="warning"
                                    />
                                </TableCell>

                                {/* Delete */}
                                <TableCell align="center">
                                    <Switch
                                        size="small"
                                        checked={resource.permissions.delete}
                                        onChange={() => handleToggle(resource.resourceId, "delete")}
                                        color="error"
                                    />
                                </TableCell>

                                {/* Visual Badge */}
                                <TableCell align="center">
                                    <Box sx={{
                                        py: 0.5,
                                        px: 1,
                                        borderRadius: 1,
                                        bgcolor: alpha(theme.palette.text.primary, 0.05),
                                        display: 'inline-flex'
                                    }}>
                                        {getBadges(resource.permissions)}
                                    </Box>
                                </TableCell>

                                {/* Octal Code */}
                                <TableCell align="right" sx={{ pr: 3 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'monospace',
                                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                                            color: 'primary.main',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 1,
                                            fontWeight: 600,
                                            display: 'inline-block'
                                        }}
                                    >
                                        {getOctalCode(resource.permissions)}00
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
