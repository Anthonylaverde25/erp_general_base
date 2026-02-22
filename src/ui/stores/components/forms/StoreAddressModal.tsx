import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import AddressForm from '@/ui/address/components/forms/AddressForm';
import { useFormContext } from 'react-hook-form';

type Props = {
	open: boolean;
	onClose: () => void;
	prefix?: string;
};

export default function StoreAddressModal({ open, onClose, prefix = 'address' }: Props) {
	const { trigger } = useFormContext();

	const handleSave = async () => {
		// Trigger validation for address fields only
		const result = await trigger(prefix);

		if (result) {
			onClose();
		}
	};

	return (
		<Dialog
			open={open}
			onClose={(e, reason) => {
				if (reason !== 'backdropClick') onClose();
			}}
			maxWidth="md"
			fullWidth
		>
			<DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography
					variant="h6"
					fontWeight={700}
				>
					Dirección de la tienda
				</Typography>
				<IconButton
					onClick={onClose}
					size="small"
				>
					<Close fontSize="small" />
				</IconButton>
			</DialogTitle>
			<DialogContent dividers>
				<Box sx={{ pt: 1 }}>
					<AddressForm prefix={prefix} />
				</Box>
			</DialogContent>
			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button
					onClick={onClose}
					color="inherit"
				>
					Cancelar
				</Button>
				<Button
					onClick={handleSave}
					variant="contained"
					color="primary"
				>
					Guardar Dirección
				</Button>
			</DialogActions>
		</Dialog>
	);
}
