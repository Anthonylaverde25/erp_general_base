import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField } from '@mui/material';

interface CashRegisterReconciliationDialogProps {
	open: boolean;
	onClose: () => void;
	closingBalanceReal: number;
	onConfirm: (notes?: string) => void;
	isLoading?: boolean;
}

export default function CashRegisterReconciliationDialog({
	open,
	onClose,
	closingBalanceReal,
	onConfirm,
	isLoading = false
}: CashRegisterReconciliationDialogProps) {
	const [notes, setNotes] = useState('');

	useEffect(() => {
		if (open) {
			setNotes('');
		}
	}, [open]);

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				<Typography variant="h6" fontWeight={800}>
					Arqueo de Caja (Cierre Z)
				</Typography>
			</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
				<TextField
					fullWidth
					variant="filled"
					label="Saldo real de cierre"
					type="number"
					value={closingBalanceReal}
					InputProps={{ readOnly: true }}
				/>
				<TextField
					fullWidth
					variant="filled"
					label="Glosa / Justificación"
					multiline
					rows={2}
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
				/>
				<Box sx={{ borderLeft: '4px solid #005483', pl: 1.5 }}>
					<Typography variant="caption" color="text.secondary">
						Los montos declarados se enviarán al backend para cierre de sesión.
					</Typography>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancelar</Button>
				<Button
					variant="contained"
					onClick={() => onConfirm(notes)}
					disabled={isLoading}
				>
					Confirmar Cierre Z
				</Button>
			</DialogActions>
		</Dialog>
	);
}
