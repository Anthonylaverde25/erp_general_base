import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface RecordPaymentFooterProps {
    totalAllocated: number;
    amount: number;
    isPending: boolean;
    isOverAllocated: boolean;
    onClose: () => void;
    onConfirm: () => void;
    formatMoney: (val: number) => string;
}

export function RecordPaymentFooter({
    totalAllocated,
    amount,
    isPending,
    isOverAllocated,
    onClose,
    onConfirm,
    formatMoney
}: RecordPaymentFooterProps) {
    const remaining = Math.max(0, amount - totalAllocated);
    
    return (
        <Box sx={{ 
            px: 3, 
            py: 2, 
            bgcolor: '#f8fafc', 
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Box sx={{ display: 'flex', gap: 4 }}>
                <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', display: 'block' }}>TOTAL ASIGNADO</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>{formatMoney(totalAllocated)}</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', display: 'block' }}>RESTANTE</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: isOverAllocated ? '#ef4444' : '#107e3e' }}>
                        {formatMoney(remaining)}
                    </Typography>
                </Box>
                {isOverAllocated && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#ef4444' }}>
                        <AlertTriangle size={14} />
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>SOBRE-ASIGNADO</Typography>
                    </Box>
                )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b' }}>
                    Cancelar
                </Button>
                <Button 
                    onClick={onConfirm}
                    variant="contained"
                    disabled={isPending || amount <= 0 || isOverAllocated}
                    sx={{ 
                        textTransform: 'none', 
                        fontWeight: 800,
                        bgcolor: isOverAllocated ? '#ef4444' : '#005483',
                        px: 3,
                        borderRadius: '2px',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: isOverAllocated ? '#dc2626' : '#003d5f' }
                    }}
                >
                    {isPending ? <CircularProgress size={18} color="inherit" /> : <CheckCircle2 size={16} style={{ marginRight: 8 }} />}
                    Confirmar Registro
                </Button>
            </Box>
        </Box>
    );
}
