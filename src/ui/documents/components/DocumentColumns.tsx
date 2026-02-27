import { MRT_ColumnDef } from 'material-react-table';
import { Chip, Typography } from '@mui/material';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { Link } from 'react-router';

export const DocumentColumns: MRT_ColumnDef<DocumentEntity>[] = [
    {
        accessorKey: 'number_serie',
        header: 'Número',
        size: 150,
        Cell: ({ row }) => (
            <Typography
                variant="body2"
                fontWeight={600}
                component={Link}
                to={`/sales/${row.original.id}`}
                sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline'
                    }
                }}
            >
                {row.original.number_serie || '-'}
            </Typography>
        )
    },
    {
        accessorKey: 'partner_name',
        header: 'Partner',
        size: 200,
        Cell: ({ row }) => (
            <Typography variant="body2">
                {row.original.partner_name || 'N/A'}
            </Typography>
        )
    },
    {
        accessorKey: 'document_type_name',
        header: 'Tipo',
        size: 150,
    },
    {
        accessorKey: 'status',
        header: 'Estado',
        size: 120,
        Cell: ({ row }) => {
            const status = row.original.status;
            let color: 'default' | 'success' | 'warning' | 'error' = 'default';

            switch (status) {
                case 'issued': color = 'success'; break;
                case 'draft': color = 'warning'; break;
                case 'cancelled': color = 'error'; break;
            }

            return <Chip label={status} size="small" color={color} sx={{ textTransform: 'capitalize' }} />;
        }
    },
    {
        accessorKey: 'issue_date',
        header: 'Fecha',
        size: 120,
    },
    {
        accessorKey: 'total',
        header: 'Total',
        size: 120,
        Cell: ({ row }) => (
            <Typography variant="body2" fontWeight={600}>
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(row.original.total)}
            </Typography>
        )
    }
];
