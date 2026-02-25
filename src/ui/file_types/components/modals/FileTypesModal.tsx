import { Dialog, DialogContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import FileTypesForm from '../forms/FileTypesForm';
import { FileTypeEntity } from '@/domain/entities/file_types/FileTypeEntity';

interface FileTypesModalProps {
    open: boolean;
    onClose: () => void;
    fileType?: FileTypeEntity | null;
}

export default function FileTypesModal({ open, onClose, fileType }: FileTypesModalProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    p: 2
                }
            }}
        >
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500]
                }}
            >
                <Close />
            </IconButton>

            <DialogContent>
                <FileTypesForm
                    fileType={fileType}
                    onCancel={onClose}
                    onSuccess={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}
