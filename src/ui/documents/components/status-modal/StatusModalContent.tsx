import { Box, Typography, MenuItem, CircularProgress, TextField } from '@mui/material';
import { DocumentEntity, DocumentStatus } from '@/domain/entities/documents/DocumentEntity';

interface StatusModalContentProps {
    document: DocumentEntity;
    loading: boolean;
    selectedKey: string;
    availableStatuses: DocumentStatus[];
    onStatusChange: (key: string) => void;
}

export function StatusModalContent({
    document,
    loading,
    selectedKey,
    availableStatuses,
    onStatusChange
}: StatusModalContentProps) {
    return (
        <Box id="transition-modal-description" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Field selection area */}


            {/* Select */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : (
                <TextField
                    select
                    fullWidth
                    label="Nuevo Estado"
                    variant="filled"
                    size="small"
                    value={selectedKey}
                    onChange={(e) => onStatusChange(e.target.value)}
                >
                    {availableStatuses.map((s) => (
                        <MenuItem key={s.key} value={s.key}>
                            <Typography variant="body2">
                                {s.name}
                            </Typography>
                        </MenuItem>
                    ))}
                </TextField>
            )}
        </Box>
    );
}
