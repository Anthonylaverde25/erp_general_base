import { Box, TextField, MenuItem, Typography, FormControlLabel, Switch, Button } from '@mui/material';

interface RecordPaymentFormProps {
    amount: number;
    setAmount: (val: number) => void;
    totalBalance: number;
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
    totalBalance,
    date, setDate,
    methodId, setMethodId,
    reference, setReference,
    notes, setNotes,
    enableNotes, setEnableNotes,
    paymentMethods,
    isLoadingMethods
}: RecordPaymentFormProps) {
    const formatMoney = (val: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Fila 1: Datos principales (3 columnas) */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2.5, alignItems: 'start' }}>
                <Box sx={{ position: 'relative' }}>
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
                    <Button
                        className='px-1'
                        size="small"
                        onClick={() => setAmount(totalBalance)}
                        sx={{
                            position: 'absolute',
                            bottom: -25,
                            left: 0,
                            fontSize: '0.6rem',
                            fontWeight: 900,
                            color: '#005483',
                            justifyContent: 'flex-start',
                            p: 0,
                            minWidth: 'auto',
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                        }}
                    >
                        PAGAR TOTAL: {formatMoney(totalBalance)}
                    </Button>
                </Box>

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
