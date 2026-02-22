import { Dialog, DialogContent } from '@mui/material';
import CreateBankAccountForm from '../forms/CreateBankAccountForm';

interface CreateBankAccountModalProps {
	open: boolean;
	onClose: () => void;
}

export default function CreateBankAccountModal({ open, onClose }: CreateBankAccountModalProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
		>
			<DialogContent>
				<CreateBankAccountForm
					onCancel={onClose}
					onSuccess={onClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
