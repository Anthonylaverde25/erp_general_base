import { Box, Typography, IconButton } from '@mui/material';
import { X, Landmark } from 'lucide-react';

interface RecordPaymentHeaderProps {
    numberSerie: string | null;
    partnerName: string | null;
    onClose: () => void;
}

export function RecordPaymentHeader({ numberSerie, partnerName, onClose }: RecordPaymentHeaderProps) {
    return (
        <Box sx={{ 
            px: 3, 
            py: 2, 
            bgcolor: '#f8fafc', 
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: '#005483', p: 0.8, borderRadius: '4px', display: 'flex' }}>
                    <Landmark size={18} color="white" />
                </Box>
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        Consignar Pago del Cliente
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                        {numberSerie} • {partnerName}
                    </Typography>
                </Box>
            </Box>
            <IconButton onClick={onClose} size="small">
                <X size={18} />
            </IconButton>
        </Box>
    );
}
