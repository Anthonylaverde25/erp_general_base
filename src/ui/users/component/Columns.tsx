import { MRT_ColumnDef } from 'material-react-table';
import { Avatar, Chip, Typography, Box } from "@mui/material";
import { UserType } from '@/types/user.types';

export const UserColumns: MRT_ColumnDef<UserType>[] = [
    {
        accessorKey: 'name',
        header: 'Usuario',
        size: 250,
        enableResizing: false,
        enableColumnFilter: true,
        Cell: ({ row }) => {
            const user = row.original;
            const name = user.name || 'Sin nombre';
            const email = user.email || '';

            // Get initials from name
            const getInitials = (fullName: string) => {
                const parts = fullName.trim().split(' ');
                if (parts.length >= 2) {
                    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
                }
                return fullName.substring(0, 2).toUpperCase();
            };

            // Generate color from email
            const stringToColor = (str: string) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash);
                }
                const hue = hash % 360;
                return `hsl(${hue}, 65%, 50%)`;
            };

            return (
                <Box className="flex items-center gap-3 py-1">
                    <Avatar
                        sx={{
                            width: 42,
                            height: 42,
                            bgcolor: stringToColor(email),
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            boxShadow: 1
                        }}
                    >
                        {getInitials(name)}
                    </Avatar>
                    <Box className="flex flex-col">
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                                fontSize: '0.9375rem',
                                lineHeight: 1.3
                            }}
                        >
                            {user.full_name || `${user.name} ${user.last_name || ''}`}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                fontSize: '0.8125rem',
                                mt: 0.25
                            }}
                        >
                            {email}
                        </Typography>
                    </Box>
                </Box>
            );
        },
    },
    {
        accessorKey: 'email',
        header: 'Email',
        size: 220,
        enableResizing: false,
        enableColumnFilter: true,
        Cell: ({ cell }) => (
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    fontSize: '0.875rem',
                    fontFamily: 'monospace'
                }}
            >
                {cell.getValue<string>()}
            </Typography>
        ),
    },
    {
        accessorKey: 'role.name',
        id: 'role',
        header: 'Rol',
        size: 150,
        enableResizing: false,
        enableColumnFilter: true,
        Cell: ({ row }) => {
            const role = row.original.role;

            if (!role) {
                return (
                    <Chip
                        label="Sin rol"
                        size="small"
                        color="default"
                        sx={{
                            opacity: 0.7
                        }}
                    />
                );
            }

            return (

                <Chip className='w-[100px]' label={role.name} variant="filled" />
            );
        },
    },
    {
        accessorKey: 'phone',
        header: 'Teléfono',
        size: 140,
        enableResizing: false,
        enableColumnFilter: false,
        Cell: ({ row }) => {
            const user = row.original;
            return (
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: '0.875rem',
                        fontFamily: 'monospace'
                    }}
                >
                    {user.phone || '-'}
                </Typography>
            );
        },
    },
    {
        accessorKey: 'is_active',
        header: 'Estado',
        size: 120,
        enableResizing: false,
        filterVariant: 'checkbox',
        Cell: ({ row }) => {
            const user = row.original;
            const isActive = user.is_active;

            return (
                <Chip className='w-[100px]' label={isActive ? 'Activo' : 'Inactivo'} variant="filled" />


            );
        },
    }
];
