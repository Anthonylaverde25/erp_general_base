import { Box, TextField, MenuItem, Typography, FormControlLabel, Switch } from '@mui/material';

interface RecordPaymentFormProps {
    amount: number;
    setAmount: (val: number) => void;
    date: string;
    setDate: (val: string) => void;
    methodId: number | '';
    setMethodId: (val: number | '') => void;
    reference: string;
    setReference: (val: string) => void;
    notes: string;
    setNotes: (val: string) => void;
    enableNotes: boolean;
    setEnableNotes: (val: boolean) => void;
    paymentMethods: any[] | undefined;
    isLoadingMethods: boolean;
}

export function RecordPaymentForm({
    amount, setAmount,
    date, setDate,
    methodId, setMethodId,
    reference, setReference,
    notes, setNotes,
    enableNotes, setEnableNotes,
    paymentMethods,
    isLoadingMethods
}: RecordPaymentFormProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Fila 1: Datos principales (3 columnas) */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2.5 }}>
                <TextField
                    id="filled-basic-amount"
                    label="IMPORTE A PAGAR"
                    variant="filled"
                    fullWidth
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    InputProps={{
                        endAdornment: <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>EUR</Typography>,
                        sx: { fontWeight: 800 }
                    }}
                />

                <TextField
                    id="filled-basic-date"
                    label="FECHA DE PAGO"
                    variant="filled"
                    fullWidth
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    id="filled-basic-method"
                    select
                    label="MÉTODO DE PAGO"
                    variant="filled"
                    fullWidth
                    value={methodId}
                    onChange={(e) => setMethodId(Number(e.target.value))}
                    disabled={isLoadingMethods}
                >
                    <MenuItem value="" disabled>Seleccione vía...</MenuItem>
                    {paymentMethods?.map((method: any) => (
                        <MenuItem key={method.id} value={method.id}>{method.name}</MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* Fila 2: Referencia (80%) + Habilitar Notas (20%) */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2.5 }}>
                <Box sx={{ flex: '0 0 80%' }}>
                    <TextField
                        id="filled-basic-ref"
                        label="REFERENCIA / OPERACIÓN"
                        variant="filled"
                        fullWidth
                        placeholder="Ej: TRX-9920-CLIENT"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                    />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', pb: 1 }}>
                    <FormControlLabel
                        control={
                            <Switch 
                                size="small" 
                                checked={enableNotes} 
                                onChange={(e) => setEnableNotes(e.target.checked)}
                                sx={{ 
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#005483' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#005483' }
                                }}
                            />
                        }
                        label={
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                {enableNotes ? 'Notas ON' : 'Notas OFF'}
                            </Typography>
                        }
                        labelPlacement="start"
                    />
                </Box>
            </Box>

            {/* Fila 3: Observaciones (Ancho completo, condicional) */}
            {enableNotes && (
                <TextField
                    id="filled-basic-notes"
                    label="OBSERVACIONES"
                    variant="filled"
                    fullWidth
                    multiline
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    sx={{ animation: 'fadeIn 0.2s ease-in' }}
                />
            )}
            
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </Box>
    );
}
