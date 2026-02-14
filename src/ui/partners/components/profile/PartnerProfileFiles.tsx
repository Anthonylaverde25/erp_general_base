
import {
    Box,
    Typography,
    Paper,
    Button
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';

interface PartnerProfileFilesProps {
    partner: PartnerEntity;
}

export default function PartnerProfileFiles({ partner }: PartnerProfileFilesProps) {
    return (
        <Box sx={{ p: 3 }}>
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    No hay archivos adjuntos para este socio
                </Typography>
                <Button
                    size="small"
                    startIcon={<Add sx={{ fontSize: 16 }} />}
                    sx={{ textTransform: 'none', fontWeight: 600, mt: 1 }}
                >
                    Subir archivo
                </Button>
            </Paper>
        </Box>
    );
}
