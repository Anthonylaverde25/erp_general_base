import { TableRow, TableCell, Checkbox, Typography, Box, Stack, Tooltip, IconButton, alpha } from '@mui/material';
import { format } from 'date-fns';
import { Eye, Edit2 } from 'lucide-react';
import { SAP_THEME } from './theme';
import { InvoiceRowProps } from './types';

export default function InvoiceRow({ doc, isSelected, onToggle, onStatusClick, navigate }: InvoiceRowProps) {
    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

    return (
        <TableRow
            hover
            onClick={() => navigate(`/sales/view/${doc.id}`)}
            sx={{
                cursor: 'pointer',
                bgcolor: (theme) => isSelected ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                transition: SAP_THEME.transition,
                '& td': { py: 0.75, px: 1.5, borderBottom: (theme) => `1px solid ${theme.palette.divider}`, fontSize: '0.8rem' },
                '&:last-child td': { borderBottom: 'none' },
                '&:hover td': { bgcolor: 'action.hover' }
            }}
        >
            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                    size="small"
                    checked={isSelected}
                    onChange={() => onToggle(doc.id.toString())}
                    sx={{ p: 0.5, '&.Mui-checked': { color: (theme) => theme.palette.primary.main } }}
                />
            </TableCell>
            <TableCell>
                <Typography sx={{ fontWeight: 700, color: (theme) => theme.palette.primary.main, fontSize: '0.8rem', letterSpacing: -0.1 }}>
                    {doc.number_serie || '(Sin Número)'}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.7rem' }}>
                    {doc.document_type_name}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.8rem' }}>
                    {doc.issue_date ? format(new Date(doc.issue_date), 'dd/MM/yyyy') : '- - -'}
                </Typography>
            </TableCell>
            <TableCell>
                <Box
                    component="span"
                    onClick={(e) => { e.stopPropagation(); onStatusClick(doc); }}
                    sx={{
                        px: 1, py: 0.25, borderRadius: '2px', fontSize: '0.6rem', fontWeight: 800,
                        bgcolor: 'action.selected', color: 'text.secondary', cursor: 'pointer',
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        display: 'inline-block',
                        transition: SAP_THEME.transition,
                        '&:hover': { bgcolor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.primary.contrastText, borderColor: (theme) => theme.palette.primary.main }
                    }}
                >
                    {doc.status?.name}
                </Box>
            </TableCell>
            <TableCell align="right">
                <Typography sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.85rem' }}>
                    {formatCurrency(doc.total)}
                </Typography>
            </TableCell>
            <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Ver Detalle">
                        <IconButton 
                            size="small" 
                            onClick={() => navigate(`/sales/view/${doc.id}`)}
                            sx={{ p: 0.5, color: 'text.secondary', opacity: 0.5, '&:hover': { opacity: 1, color: (theme) => theme.palette.primary.main, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) } }}
                        >
                            <Eye size={16} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                        <IconButton 
                            size="small" 
                            onClick={() => navigate(`/sales/edit/${doc.document_type_code}/${doc.id}`)}
                            sx={{ p: 0.5, color: 'text.secondary', opacity: 0.5, '&:hover': { opacity: 1, color: (theme) => theme.palette.primary.main, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) } }}
                        >
                            <Edit2 size={16} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </TableCell>
        </TableRow>
    );
}
