import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FuseLoading from '@fuse/core/FuseLoading';
import { PartnersForm } from '../forms/PartnersForm';
import { useShowPartner } from '@/features/partners/hooks/useShowPartner';

interface UpdatePartnerModalProps {
	open: boolean;
	onClose: () => void;
	partnerId?: number;
}

export default function UpdatePartnerModal({ open, onClose, partnerId }: UpdatePartnerModalProps) {
	const { partner, isLoading } = useShowPartner(partnerId || 0);

	if (!partnerId) return null;

	return (
		<Dialog
			open={open}
			onClose={onClose}
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
				{isLoading || !partner ? (
					<div className="p-8 text-center flex items-center justify-center min-h-[600px]">
						<FuseLoading />
					</div>
				) : (
					<PartnersForm
						data={partner}
						onCancel={onClose}
						onSuccess={onClose}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}

