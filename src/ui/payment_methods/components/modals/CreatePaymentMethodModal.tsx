import { Dialog, DialogContent } from '@mui/material';
import CreatePaymentMethodForm from '../forms/CreatePaymentMethodForm';

interface CreatePaymentMethodModalProps {
	open: boolean;
	onClose: () => void;
}

export default function CreatePaymentMethodModal({ open, onClose }: CreatePaymentMethodModalProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
		>
			<DialogContent>
				<CreatePaymentMethodForm
					onCancel={onClose}
					onSuccess={onClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
