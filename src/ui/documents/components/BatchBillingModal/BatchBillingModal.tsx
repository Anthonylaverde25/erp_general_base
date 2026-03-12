import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { useBatchBilling } from './useBatchBilling';

interface BatchBillingModalProps {
    open: boolean;
    onClose: () => void;
    selectedDocuments: DocumentEntity[];
    onSuccess?: () => void;
}

export default function BatchBillingModal({ open, onClose, selectedDocuments, onSuccess }: BatchBillingModalProps) {
    const {
        numberSeries,
        isLoadingSeries,
        selectedSeriesId,
        setSelectedSeriesId,
        saving,
        handleConfirm,
        targetDocTypeCode
    } = useBatchBilling(open, selectedDocuments, onClose, onSuccess);

    if (selectedDocuments.length === 0) return null;

    const partnerName = selectedDocuments[0]?.partner_name || 'Varios';
    const totalAmount = selectedDocuments.reduce((acc, doc) => acc + doc.total, 0);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: '100%',
                    maxWidth: 500,
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 700 }}>
                Facturación Agrupada
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 3 }}>
                    Estás a punto de generar una factura consolidada para <strong>{selectedDocuments.length}</strong> documentos de <strong>{partnerName}</strong>.
                    <br />
                    Importe total estimado: <strong>{totalAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</strong>
                </DialogContentText>

                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel id="series-select-label">Serie de Numeración (Factura)</InputLabel>
                        <Select
                            labelId="series-select-label"
                            value={selectedSeriesId}
                            onChange={(e) => setSelectedSeriesId(Number(e.target.value))}
                            disabled={isLoadingSeries}
                        >
                            {numberSeries?.map((series) => (
                                <MenuItem key={series.id} value={series.id}>
                                    Serie: {series.serie} (Año: {series.year})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    sx={{ textTransform: 'none', px: 3 }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="primary"
                    disabled={saving || isLoadingSeries || !selectedSeriesId}
                    sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
                >
                    {saving ? <CircularProgress size={20} color="inherit" /> : 'Generar Factura'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
