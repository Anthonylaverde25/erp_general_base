
import {
    Box,
    Typography,
    Paper,
    Stack,
    Chip,
    alpha
} from '@mui/material';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';

interface PartnerProfileTaxesProps {
    partner: PartnerEntity;
}

export default function PartnerProfileTaxes({ partner }: PartnerProfileTaxesProps) {
    const showSaleTaxes = partner.role === 'client' || partner.role === 'client_supplier';
    const showPurchaseTaxes = partner.role === 'supplier' || partner.role === 'client_supplier';

    return (
        <Box sx={{ p: 3, maxWidth: 900 }}>
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {showSaleTaxes && (
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="overline" fontWeight={700} sx={{ letterSpacing: '0.1em', fontSize: '0.65rem', color: 'text.secondary', display: 'block', mb: 2 }}>
                            Impuestos de Venta
                        </Typography>
                        {partner.sale_taxes && partner.sale_taxes.length > 0 ? (
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {partner.sale_taxes.map((tax) => (
                                    <Chip
                                        key={tax.id}
                                        label={`${tax.name} (${tax.percentage}%)`}
                                        size="small"
                                        sx={{
                                            bgcolor: alpha('#4caf50', 0.1),
                                            color: '#4caf50',
                                            fontWeight: 500,
                                            borderColor: alpha('#4caf50', 0.3),
                                            border: '1px solid'
                                        }}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Typography variant="body2" color="text.secondary">Sin impuestos de venta asignados</Typography>
                        )}
                    </Paper>
                )}
                {showPurchaseTaxes && (
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="overline" fontWeight={700} sx={{ letterSpacing: '0.1em', fontSize: '0.65rem', color: 'text.secondary', display: 'block', mb: 2 }}>
                            Impuestos de Compra
                        </Typography>
                        {partner.purchase_taxes && partner.purchase_taxes.length > 0 ? (
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {partner.purchase_taxes.map((tax) => (
                                    <Chip
                                        key={tax.id}
                                        label={`${tax.name} (${tax.percentage}%)`}
                                        size="small"
                                        sx={{
                                            bgcolor: alpha('#2196f3', 0.1),
                                            color: '#2196f3',
                                            fontWeight: 500,
                                            borderColor: alpha('#2196f3', 0.3),
                                            border: '1px solid'
                                        }}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Typography variant="body2" color="text.secondary">Sin impuestos de compra asignados</Typography>
                        )}
                    </Paper>
                )}
                {!showSaleTaxes && !showPurchaseTaxes && (
                    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', gridColumn: '1 / -1' }}>
                        <Typography variant="body1" color="text.secondary">
                            Este tipo de socio no tiene impuestos configurables
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Box>
    );
}
