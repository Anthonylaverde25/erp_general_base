import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress, Box } from '@mui/material';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { useDocumentStatus } from './useDocumentStatus';
import { StatusModalContent } from './StatusModalContent';

interface DocumentStatusModalProps {
    open: boolean;
    onClose: () => void;
    document: DocumentEntity | null;
    onStatusUpdated?: () => void;
}

export default function DocumentStatusModal({ open, onClose, document, onStatusUpdated }: DocumentStatusModalProps) {
    const {
        selectedKey,
        setSelectedKey,
        availableStatuses,
        loading,
        saving,
        handleSave,
        hasChanged
    } = useDocumentStatus(open, document, onClose, onStatusUpdated);

    if (!document) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                sx: {
                    width: '100%',
                    maxWidth: 500,
                }
            }}
        >
            <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700 }}>
                Cambiar Estado
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ mb: 3 }}>
                    Documento <strong>{document.number_serie || '(Borrador)'}</strong>
                    <br />
                    {document.document_type_name} · {document.partner_name}
                </DialogContentText>

                <StatusModalContent
                    document={document}
                    loading={loading}
                    selectedKey={selectedKey}
                    availableStatuses={availableStatuses}
                    onStatusChange={setSelectedKey}
                />
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
                    onClick={handleSave}
                    variant="contained"
                    color="secondary"
                    autoFocus
                    disabled={!hasChanged || saving || loading}
                    sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
                >
                    {saving ? <CircularProgress size={20} color="inherit" /> : 'Actualizar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
