import { Box, Typography, MenuItem, CircularProgress, TextField } from '@mui/material';
import { DocumentEntity, DocumentStatus } from '@/domain/entities/documents/DocumentEntity';

import { NumberSeriesEntity } from '@/domain/entities/number_series/NumberSeriesEntity';

interface StatusModalContentProps {
    document: DocumentEntity;
    loading: boolean;
    selectedKey: string;
    availableStatuses: DocumentStatus[];
    onStatusChange: (key: string) => void;
    needsSeriesSelection?: boolean;
    numberSeries?: NumberSeriesEntity[] | null;
    isLoadingSeries?: boolean;
    selectedSeriesId?: number | '';
    onSeriesChange?: (id: number | '') => void;
}

export function StatusModalContent({
    document,
    loading,
    selectedKey,
    availableStatuses,
    onStatusChange,
    needsSeriesSelection,
    numberSeries,
    isLoadingSeries,
    selectedSeriesId,
    onSeriesChange
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

            {/* Series Selection for Drafts moving to non-draft */}
            {needsSeriesSelection && (
                <Box>
                    {isLoadingSeries ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={20} />
                        </Box>
                    ) : (
                        <TextField
                            select
                            fullWidth
                            label="Serie Numérica"
                            variant="filled"
                            size="small"
                            value={selectedSeriesId}
                            onChange={(e) => onSeriesChange?.(Number(e.target.value) || '')}
                            helperText="Debe elegir una serie para generar el número de documento."
                        >
                            {numberSeries?.map((ns) => (
                                <MenuItem key={ns.id} value={ns.id}>
                                    Serie {ns.serie} ({ns.year})
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                </Box>
            )}
        </Box>
    );
}
