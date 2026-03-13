import { useState, Fragment } from 'react';
import { TableRow, TableCell, IconButton, Stack, Avatar, Box, Typography, Collapse, Table, TableHead, TableBody, Checkbox, Divider } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { SAP_THEME } from './theme';
import { PartnerRowProps } from './types';
import InvoiceRow from './InvoiceRow';

export default function PartnerRow({
    partnerName,
    docs,
    selectedIds,
    onTogglePartner,
    onToggleDoc,
    onStatusClick,
    navigate
}: PartnerRowProps) {
    const [open, setOpen] = useState(false);

    const firstDoc = docs[0];
    const partnerEmail = firstDoc?.partner_email;
    const partnerCIF = firstDoc?.partner_cif;
    const partnerVAT = firstDoc?.partner_vat_number;

    const allSelected = docs.length > 0 && docs.every(d => selectedIds.includes(d.id.toString()));
    const someSelected = docs.some(d => selectedIds.includes(d.id.toString())) && !allSelected;

    const totalAmount = docs.reduce((acc, d) => acc + (d.total || 0), 0);
    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

    const getInitials = (text: string) => {
        const parts = text.trim().split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        return text.substring(0, 2).toUpperCase();
    };

    return (
        <Fragment>
            <TableRow
                sx={{
                    bgcolor: SAP_THEME.masterBg,
                    transition: SAP_THEME.transition,
                    '&:hover': { bgcolor: SAP_THEME.hover },
                    '& .MuiTableCell-root': { borderBottom: `1px solid ${SAP_THEME.border}` }
                }}
            >
                <TableCell 
                    sx={{ 
                        width: 48, 
                        py: 1.5
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={() => setOpen(!open)}
                        sx={{
                            color: SAP_THEME.primary,
                            transition: SAP_THEME.transition,
                            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)'
                        }}
                    >
                        <FuseSvgIcon size={20}>heroicons-outline:chevron-down</FuseSvgIcon>
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            {getInitials(partnerName)}
                        </Avatar>
                        <Box>
                            <Typography variant="body1" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.2, letterSpacing: -0.2 }}>
                                {partnerName}
                            </Typography>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
                                <Typography variant="caption" sx={{ color: SAP_THEME.textSecondary, fontWeight: 500 }}>
                                    {docs.length} {docs.length === 1 ? 'documento' : 'documentos'}
                                </Typography>
                                {(partnerEmail || partnerCIF || partnerVAT) && (
                                    <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto', bgcolor: SAP_THEME.border }} />
                                )}
                                <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.7, fontWeight: 500 }}>
                                    {[partnerCIF || partnerVAT, partnerEmail].filter(Boolean).join(' • ')}
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </TableCell>
                <TableCell align="right">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography variant="caption" sx={{ color: SAP_THEME.textSecondary, fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Resumen de Importes
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', letterSpacing: -0.8 }}>
                            {formatCurrency(totalAmount)}
                        </Typography>
                    </Box>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2, px: 3, bgcolor: 'background.paper' }}>
                            <Table size="small" sx={{ border: `1px solid ${SAP_THEME.border}`, borderRadius: 1, overflow: 'hidden' }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#fbfcfd', '& th': { color: SAP_THEME.textSecondary, fontWeight: 700, fontSize: '0.65rem', borderBottom: `1px solid ${SAP_THEME.border}`, textTransform: 'uppercase', letterSpacing: 1, py: 1.5 } }}>
                                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                                            <Checkbox
                                                size="small"
                                                checked={allSelected}
                                                indeterminate={someSelected}
                                                onChange={(e) => onTogglePartner(e.target.checked)}
                                                sx={{ color: SAP_THEME.borderDark, '&.Mui-checked': { color: SAP_THEME.primary } }}
                                            />
                                        </TableCell>
                                        <TableCell>IDENTIFICACIÓN</TableCell>
                                        <TableCell>FECHA EMISIÓN</TableCell>
                                        <TableCell>ESTADO GESTIÓN</TableCell>
                                        <TableCell align="right" sx={{ pr: 3 }}>IMPORTE TOTAL</TableCell>
                                        <TableCell align="right">ACCIONES</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ '& tr:nth-of-type(even)': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                                    {docs.map((doc) => (
                                        <InvoiceRow
                                            key={doc.id}
                                            doc={doc}
                                            isSelected={selectedIds.includes(doc.id.toString())}
                                            onToggle={onToggleDoc}
                                            onStatusClick={onStatusClick}
                                            navigate={navigate}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}
