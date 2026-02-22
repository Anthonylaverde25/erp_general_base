import { Dialog, DialogContent } from '@mui/material';
import UpdatePaymentMethodForm from '../forms/UpdatePaymentMethodForm';

interface UpdatePaymentMethodModalProps {
	open: boolean;
	onClose: () => void;
	paymentMethodId: number;
}

export default function UpdatePaymentMethodModal({ open, onClose, paymentMethodId }: UpdatePaymentMethodModalProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
		>
			<DialogContent>
				<UpdatePaymentMethodForm
					paymentMethodId={paymentMethodId}
					onCancel={onClose}
					onSuccess={onClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
