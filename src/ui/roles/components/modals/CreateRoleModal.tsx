import { Dialog } from '@mui/material';
import CreateRoleForm from '../forms/CreateRoleForm';

interface CreateRoleDialogProps {
	open: boolean;
	onClose: () => void;
}

export default function CreateRoleDialog({ open, onClose }: CreateRoleDialogProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 0,
					bgcolor: 'background.paper',
					boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
					width: '100%'
				}
			}}
		>
			<CreateRoleForm
				onCancel={onClose}
				onSuccess={onClose}
			/>
		</Dialog>
	);
}
