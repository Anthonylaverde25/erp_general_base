import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface CashRegisterMovementDialogProps {
	open: boolean;
	type: 'deposit' | 'withdrawal';
	onClose: () => void;
	onConfirm: (amount: number, note?: string) => void;
	isLoading?: boolean;
}

export default function CashRegisterMovementDialog({
	open,
	type,
	onClose,
	onConfirm,
	isLoading = false
}: CashRegisterMovementDialogProps) {
	const [amount, setAmount] = useState('');
	const [note, setNote] = useState('');

	useEffect(() => {
		if (open) {
			setAmount('');
			setNote('');
		}
	}, [open, type]);

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>{type === 'deposit' ? 'Ingresar Fondo' : 'Retirar Efectivo'}</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
				<TextField
					fullWidth
					variant="filled"
					type="number"
					label="Monto"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
				/>
				<TextField fullWidth variant="filled" label="Nota" value={note} onChange={(e) => setNote(e.target.value)} />
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancelar</Button>
				<Button variant="contained" disabled={isLoading || amount === ''} onClick={() => onConfirm(Number(amount), note)}>
					Confirmar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
