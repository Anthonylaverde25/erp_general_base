import { TableRow, TableCell, Checkbox, Typography, Box, Stack, Tooltip, IconButton } from '@mui/material';
import { format } from 'date-fns';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
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
                transition: SAP_THEME.transition,
                '&:hover td': { bgcolor: 'rgba(0,0,0,0.02)' },
                '& td': { py: 1.5, borderBottom: `1px solid ${SAP_THEME.border}` },
                '&:last-child td': { borderBottom: 'none' }
            }}
        >
            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                    size="small"
                    checked={isSelected}
                    onChange={() => onToggle(doc.id.toString())}
                    sx={{ color: SAP_THEME.borderDark, '&.Mui-checked': { color: SAP_THEME.primary } }}
                />
            </TableCell>
            <TableCell>
                <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ letterSpacing: -0.2 }}>
                    {doc.number_serie || '(Sin Número)'}
                </Typography>
                <Typography variant="caption" sx={{ color: SAP_THEME.textSecondary, fontWeight: 500, opacity: 0.8 }}>
                    {doc.document_type_name}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" fontWeight={500} color="text.secondary">
                    {doc.issue_date ? format(new Date(doc.issue_date), 'dd/MM/yyyy') : '- - -'}
                </Typography>
            </TableCell>
            <TableCell>
                <Box
                    component="span"
                    onClick={(e) => { e.stopPropagation(); onStatusClick(doc); }}
                    sx={{
                        px: 1.5, py: 0.5, borderRadius: 0.75, fontSize: '0.65rem', fontWeight: 800,
                        bgcolor: 'rgba(0,0,0,0.04)', color: 'text.secondary', cursor: 'pointer',
                        border: `1px solid ${SAP_THEME.border}`,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        transition: SAP_THEME.transition,
                        '&:hover': { bgcolor: SAP_THEME.primary, color: 'white', borderColor: SAP_THEME.primary }
                    }}
                >
                    {doc.status?.name}
                </Box>
            </TableCell>
            <TableCell align="right" sx={{ pr: 3 }}>
                <Typography variant="body2" fontWeight={700}>{formatCurrency(doc.total)}</Typography>
            </TableCell>
            <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip
                        title="Explorar Registro"
                        children={
                            <IconButton size="small" onClick={() => navigate(`/sales/view/${doc.id}`)} sx={{ color: SAP_THEME.textSecondary, opacity: 0.6, '&:hover': { opacity: 1, color: SAP_THEME.primary } }}>
                                <FuseSvgIcon size={18}>heroicons-outline:eye</FuseSvgIcon>
                            </IconButton>
                        }
                    />
                    <Tooltip
                        title="Modificar Datos"
                        children={
                            <IconButton size="small" onClick={() => navigate(`/sales/${doc.id}/edit`)} sx={{ color: SAP_THEME.textSecondary, opacity: 0.6, '&:hover': { opacity: 1, color: SAP_THEME.primary } }}>
                                <FuseSvgIcon size={18}>heroicons-outline:pencil-square</FuseSvgIcon>
                            </IconButton>
                        }
                    />
                </Stack>
            </TableCell>
        </TableRow>
    );
}
