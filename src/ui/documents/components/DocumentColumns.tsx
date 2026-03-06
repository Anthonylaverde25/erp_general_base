import { MRT_ColumnDef } from 'material-react-table';
import { Chip, Typography, Box, Avatar } from '@mui/material';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { Link } from 'react-router';
import { format } from 'date-fns';

export const getDocumentColumns = (
    operation: 'sale' | 'purchase',
    onStatusClick?: (document: DocumentEntity) => void
): MRT_ColumnDef<DocumentEntity>[] => {
    const basePath = operation === 'sale' ? '/sales' : '/purchases';

    return [
        {
            accessorKey: 'number_serie',
            header: 'Número',
            size: 180,
            Cell: ({ row }) => {
                const doc = row.original;
                return (
                    <Box className="flex flex-col py-1">
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            component={Link}
                            to={`${basePath}/view/${doc.id}`}
                            sx={{
                                textDecoration: 'none',
                                color: 'inherit',
                                '&:hover': {
                                    color: 'primary.main',
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            {doc.number_serie || '(Borrador)'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {doc.document_type_name}
                        </Typography>
                    </Box>
                )
            }
        },
        {
            accessorKey: 'partner_name',
            header: 'Partner',
            size: 250,
            Cell: ({ row }) => {
                const doc = row.original;
                const name = doc.partner_name || 'N/A';

                // Get initials from name
                const getInitials = (text: string) => {
                    const parts = text.trim().split(' ');
                    if (parts.length >= 2) {
                        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
                    }
                    return text.substring(0, 2).toUpperCase();
                };

                return (
                    <Box className="flex items-center gap-3 py-1">
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: '#1976d2',
                                fontSize: '0.75rem',
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
                                {doc.partner_email || 'Sin email'}
                            </Typography>
                        </Box>
                    </Box>
                );
            }
        },
        {
            accessorKey: 'status.name',
            header: 'Estado',
            size: 120,
            Cell: ({ row }) => {
                const status = row.original.status;
                if (!status) return null;

                // Mapear colores de status object a las variantes validas del MUI Chip
                let muiColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
                const validColors = ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'];

                // Mapeos adicionales opcionales para adaptar si es 'success', 'warning', etc.
                if (status.color && validColors.includes(status.color)) {
                    muiColor = status.color as any;
                } else if (status.key === 'issued') {
                    muiColor = 'success';
                } else if (status.key === 'draft') {
                    muiColor = 'warning';
                } else if (status.key === 'cancelled') {
                    muiColor = 'error';
                }

                return (
                    <Chip
                        label={status.name}
                        size="small"
                        variant="filled"
                        color={muiColor}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onStatusClick) {
                                onStatusClick(row.original);
                            }
                        }}
                        sx={{ fontSize: '0.75rem', cursor: 'pointer' }}
                    />
                );
            }
        },
        {
            accessorKey: 'issue_date',
            header: 'Fecha',
            size: 120,
            Cell: ({ row }) => (
                <Typography variant="body2">
                    {row.original.issue_date ? format(new Date(row.original.issue_date), 'dd/MM/yyyy') : 'N/A'}
                </Typography>
            )
        },
        {
            accessorKey: 'total',
            header: 'Total',
            size: 120,
            Cell: ({ row }) => (
                <Typography variant="body2" fontWeight={600}>
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(row.original.total)}
                </Typography>
            )
        }
    ];
};
