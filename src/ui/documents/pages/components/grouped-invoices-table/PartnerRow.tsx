import { useState, Fragment } from 'react';
import { TableRow, TableCell, IconButton, Stack, Avatar, Box, Typography, Collapse, Table, TableHead, TableBody, Checkbox, Divider, alpha } from '@mui/material';
import { ChevronDown, ChevronRight, User } from 'lucide-react';
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
    const isAnySelected = allSelected || someSelected;

    const totalAmount = docs.reduce((acc, d) => acc + (d.total || 0), 0);
    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

    return (
        <Fragment>
            <TableRow
                sx={{
                    bgcolor: (theme) => isAnySelected ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
                    transition: SAP_THEME.transition,
                    borderLeft: isAnySelected ? `4px solid ${SAP_THEME.primary}` : `4px solid transparent`,
                    '&:hover': { bgcolor: (theme) => isAnySelected ? alpha(theme.palette.primary.main, 0.08) : 'action.hover' },
                    '& .MuiTableCell-root': { py: 1, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }
                }}
            >
                <TableCell sx={{ width: 48 }}>
                    <IconButton
                        size="small"
                        onClick={() => setOpen(!open)}
                        sx={{
                            color: (theme) => open ? theme.palette.primary.main : 'text.secondary',
                            transition: SAP_THEME.transition,
                            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)'
                        }}
                    >
                        <ChevronDown size={18} />
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: (theme) => isAnySelected ? theme.palette.primary.main : 'action.selected',
                                    color: (theme) => isAnySelected ? theme.palette.primary.contrastText : 'text.secondary',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    fontWeight: 700
                                }}
                            >
                                <User size={18} />
                            </Avatar>
                        </Box>
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 700,
                                    color: (theme) => isAnySelected ? theme.palette.primary.main : 'text.primary',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.2
                                }}
                            >
                                {partnerName}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
                                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    {docs.length} {docs.length === 1 ? 'doc' : 'docs'}
                                </Typography>
                                <Divider orientation="vertical" flexItem sx={{ height: 10, my: 'auto' }} />
                                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', opacity: 0.7, fontWeight: 500 }}>
                                    {[partnerCIF || partnerVAT, partnerEmail].filter(Boolean).join(' • ')}
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </TableCell>
                <TableCell align="right">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                            Subtotal Pendiente
                        </Typography>
                        <Typography sx={{ fontWeight: 800, color: (theme) => theme.palette.primary.main, fontSize: '1.25rem', letterSpacing: -0.5 }}>
                            {formatCurrency(totalAmount)}
                        </Typography>
                    </Box>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }} colSpan={3}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ pl: 6, pr: 1, pb: 2, pt: 1, bgcolor: 'background.default' }}>
                            <Table size="small" sx={{ bgcolor: 'background.paper', border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: '4px', overflow: 'hidden' }}>
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow sx={{ '& th': { color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem', py: 1, px: 1.5, textTransform: 'uppercase', letterSpacing: 0.8, borderBottom: (theme) => `1px solid ${theme.palette.divider}` } }}>
                                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                                            <Checkbox
                                                size="small"
                                                checked={allSelected}
                                                indeterminate={someSelected}
                                                onChange={(e) => onTogglePartner(e.target.checked)}
                                                sx={{ p: 0.5, '&.Mui-checked': { color: (theme) => theme.palette.primary.main } }}
                                            />
                                        </TableCell>
                                        <TableCell>Documento</TableCell>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                        <TableCell align="right">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
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
