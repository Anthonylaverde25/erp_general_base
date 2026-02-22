import { Dialog, DialogContent } from '@mui/material';
import CreateStoreForm from '../forms/CreateStoreForm';

interface CreateStoreModalProps {
	open: boolean;
	onClose: () => void;
}

export default function CreateStoreModal({ open, onClose }: CreateStoreModalProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
		>
			<DialogContent>
				<CreateStoreForm
					onCancel={onClose}
					onSuccess={onClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
