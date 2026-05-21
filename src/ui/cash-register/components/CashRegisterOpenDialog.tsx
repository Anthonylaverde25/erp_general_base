import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField } from '@mui/material';
import { ICashRegister } from '@/types/cash-register.types';

interface CashRegisterOpenDialogProps {
	open: boolean;
	onClose: () => void;
	registers: ICashRegister[];
	onConfirm: (cashRegisterId: number, notes?: string) => void;
	isLoading?: boolean;
}

export default function CashRegisterOpenDialog({
	open,
	onClose,
	registers,
	onConfirm,
	isLoading = false
}: CashRegisterOpenDialogProps) {
	const [cashRegisterId, setCashRegisterId] = useState('');
	const [notes, setNotes] = useState('');

	useEffect(() => {
		if (open) {
			setCashRegisterId(registers[0]?.id ? String(registers[0].id) : '');
			setNotes('');
		}
	}, [open, registers]);

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Abrir Caja</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
				<TextField
					select
					fullWidth
					variant="filled"
					label="Caja"
					value={cashRegisterId}
					onChange={(e) => setCashRegisterId(e.target.value)}
				>
					{registers.map((register) => (
						<MenuItem key={register.id} value={register.id}>
							{register.name}
						</MenuItem>
					))}
				</TextField>
				<TextField
					fullWidth
					variant="filled"
					label="Notas de apertura (opcional)"
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					multiline
					rows={2}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancelar</Button>
				<Button
					variant="contained"
					disabled={isLoading || !cashRegisterId}
					onClick={() => onConfirm(Number(cashRegisterId), notes)}
				>
					Abrir sesión
				</Button>
			</DialogActions>
		</Dialog>
	);
}
