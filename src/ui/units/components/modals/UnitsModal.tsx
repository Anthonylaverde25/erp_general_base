import { Dialog, DialogContent } from '@mui/material';
import { UnitEntity } from '@/domain/entities/units/UnitEntity';
import { UnitsForm } from '../forms/UnitsForm';

interface UnitsModalProps {
	open: boolean;
	handleClose: () => void;
	mode: 'create' | 'edit';
	selectedUnit?: UnitEntity | null;
}

export default function UnitsModal({ open, handleClose, mode, selectedUnit }: UnitsModalProps) {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="sm"
			PaperProps={{
				sx: {
					borderRadius: 2,
					p: 2
				}
			}}
		>
			<DialogContent>
				<UnitsForm
					mode={mode}
					data={selectedUnit}
					onCancel={handleClose}
					onSuccess={handleClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
