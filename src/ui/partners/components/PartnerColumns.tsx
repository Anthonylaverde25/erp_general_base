import { MRT_ColumnDef } from 'material-react-table';
import { Avatar, Chip, Typography, Box } from '@mui/material';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';

export const PartnerColumns: MRT_ColumnDef<PartnerEntity>[] = [

    {
        accessorKey: 'name',
        header: 'Name',
        size: 250,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => {
            const partner = row.original;
            const name = partner.name || 'Sin nombre';

            // Get initials from name
            const getInitials = (fullName: string) => {
                const parts = fullName.trim().split(' ');
                if (parts.length >= 2) {
                    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
                }
                return fullName.substring(0, 2).toUpperCase();
            };

            // Generate color like in UserColumns
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
                            width: 38,
                            height: 38,
                            bgcolor: stringToColor(name),
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}
                    >
                        {getInitials(name)}
                    </Avatar>
                    <Box className="flex flex-col">
                        <Typography variant="body2" fontWeight={600}>
                            {name}
                        </Typography>
                        {partner.comercial_name && (
                            <Typography variant="caption" color="text.secondary">
                                {partner.comercial_name}
                            </Typography>
                        )}
                    </Box>
                </Box>
            );
        }
    },
    {
        accessorKey: 'cif',
        header: 'CIF',
        size: 100,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => (
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {row.original.cif || '-'}
            </Typography>
        )
    },
    {
        accessorKey: 'vat_number',
        header: 'VAT Number',
        size: 140,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => (
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {row.original.vat_number || '-'}
            </Typography>
        )
    },
    {
        accessorKey: 'address',
        header: 'Address',
        size: 220,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => {
            const address = row.original.address && row.original.address.length > 0 ? row.original.address[0] : null;
            if (!address) return <Typography variant="body2" color="text.secondary">-</Typography>;

            return (
                <Box>
                    <Typography variant="body2" className="truncate">
                        {address.street}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" className="truncate block">
                        {address.city} {address.postal_code}, {address.country}
                    </Typography>
                </Box>
            );
        }
    },
    {
        accessorKey: 'contact',
        header: 'Contact',
        size: 200,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => {
            const contact = row.original.contact && row.original.contact.length > 0 ? row.original.contact[0] : null;
            if (!contact) return <Typography variant="body2" color="text.secondary">-</Typography>;

            return (
                <Box>
                    <Typography variant="body2" className="truncate">
                        {contact.email}
                    </Typography>
                    {contact.phone && (
                        <Typography variant="caption" color="text.secondary">
                            {contact.phone}
                        </Typography>
                    )}
                </Box>
            );
        }
    },
    {
        accessorKey: 'role',
        header: 'Role',
        size: 150,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => {
            const role = row.original.role || 'prospect';

            // Common props for consistency with Type column
            const chipProps = {
                size: "small" as const,
                variant: "filled" as const,
                sx: { textTransform: 'capitalize' }
            };

            if (role === 'client_supplier') {
                return (
                    <Chip
                        {...chipProps}
                        label="Cliente / Proveedor"
                    />
                );
            }

            let label = 'Prospecto';

            switch (role) {
                case 'client':
                    label = 'Cliente';
                    break;
                case 'supplier':
                    label = 'Proveedor';
                    break;
                case 'prospect':
                    label = 'Prospecto';
                    break;
            }

            return (
                <Chip
                    {...chipProps}
                    label={label}
                />
            );
        }
    },
    {
        accessorKey: 'type',
        header: 'Type',
        size: 130,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => {
            const type = row.original.type;

            let label: string = type;
            switch (type) {
                case 'company': label = 'Empresa'; break;
                case 'person': label = 'Persona'; break;
                case 'public_organism': label = 'Organismo Público'; break;
                case 'prospect': label = 'Prospecto'; break;
            }

            return (
                <Chip
                    label={label}
                    size="small"
                    variant="filled" // User requested "dejalo como en la taba de user" -> User uses variant="filled"
                    // And "sacale el color", so defaulting to default color or not passing color prop
                    sx={{ textTransform: 'capitalize' }}
                />
            );
        }
    }
];
