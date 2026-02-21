import { MRT_ColumnDef } from 'material-react-table';
import { Avatar, Chip, Typography, Box } from '@mui/material';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';

export const ItemColumns: MRT_ColumnDef<ItemEntity>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        size: 250,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => {
            const item = row.original;
            const name = item.name || 'Sin nombre';

            // Get initials from name
            const getInitials = (text: string) => {
                const parts = text.trim().split(' ');
                if (parts.length >= 2) {
                    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
                }
                return text.substring(0, 2).toUpperCase();
            };

            // Generate color
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
                        src={item.image}
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
                        <Typography variant="caption" color="text.secondary">
                            {item.sku || 'SKU | No aplica'}
                        </Typography>
                    </Box>
                </Box>
            );
        }
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
        size: 100,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => (
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {row.original.sku || '-'}
            </Typography>
        )
    },
    {
        accessorKey: 'physical_profile.barcode',
        header: 'Cód. Barras',
        size: 130,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => (
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {row.original.physical_profile?.barcode || '-'}
            </Typography>
        )
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
            // 'physical' | 'service'
            switch (type) {
                case 'physical': label = 'Producto Físico'; break;
                case 'service': label = 'Servicio'; break;
            }

            return (
                <Chip
                    label={label}
                    size="small"
                    variant="filled"
                    sx={{ textTransform: 'capitalize' }}
                />
            );
        }
    },
    {
        accessorKey: 'category.name', // Access nested property
        header: 'Category',
        size: 150,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => (
            <Typography variant="body2">
                {row.original.category?.name || '-'}
            </Typography>
        )
    },
    {
        accessorKey: 'unit_name',
        header: 'Unit',
        size: 100,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => (
            <Typography variant="body2">
                {row.original.unit_name || '-'}
            </Typography>
        )
    },
    {
        accessorKey: 'sale_price',
        header: 'Price',
        size: 100,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => (
            <Typography variant="body2" fontWeight={500}>
                ${row.original.sale_price.toFixed(2)}
            </Typography>
        )
    },
    {
        accessorKey: 'total_stock',
        header: 'Stock Total',
        size: 100,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => {
            if (row.original.type !== 'physical' || !row.original.physical_profile?.is_inventoriable) {
                return <Typography variant="body2" color="text.secondary">-</Typography>;
            }
            const stock = row.original.total_stock ?? 0;
            return (
                <Typography variant="body2" fontWeight={500} color={stock > 0 ? 'success.main' : 'error.main'}>
                    {stock}
                </Typography>
            );
        }
    },
    {
        accessorKey: 'physical_profile.is_inventoriable',
        header: 'Inventariable',
        size: 130,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => {
            if (row.original.type !== 'physical') {
                return <Typography variant="body2" color="text.secondary">-</Typography>;
            }
            const isInventoriable = row.original.physical_profile?.is_inventoriable;
            const stockMin = row.original.physical_profile?.stock_min;

            return (
                <Box className="flex flex-col">
                    <Typography variant="body2" fontWeight={500}>
                        {isInventoriable ? 'Sí' : 'No'}
                    </Typography>
                    {isInventoriable && (stockMin !== undefined && stockMin !== null) && (
                        <Typography variant="caption" color="text.secondary">
                            Min: {stockMin}
                        </Typography>
                    )}
                </Box>
            );
        }
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        size: 100,
        enableResizing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => (
            <Chip
                label={row.original.is_active ? 'Activo' : 'Inactivo'}
                size="small"
                variant="filled"
                color={row.original.is_active ? 'success' : 'default'}
                sx={{ fontSize: '0.75rem' }}
            />
        )
    }
];
