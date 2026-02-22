import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { PartnersForm } from '@/ui/partners/components/forms/PartnersForm';

interface CreatePartnerModalProps {
	open: boolean;
	handleClose: () => void;
}

export function CreatePartnerModal({ open, handleClose }: CreatePartnerModalProps) {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="md"
			PaperProps={{
				sx: {
					bgcolor: 'background.default',
					minHeight: '600px',
					width: '100%',
					borderRadius: 2
				}
			}}
		>
			<DialogContent className="bg-background-default overflow-y-auto p-0">
				<PartnersForm onCancel={handleClose} />
			</DialogContent>
		</Dialog>
	);
}
