import { Dialog, DialogContent } from '@mui/material';
import { UnitTypeEntity } from '@/domain/entities/unit_types/UnitTypeEntity';
import { UnitTypesForm } from '../forms/UnitTypesForm';

interface UnitTypesModalProps {
	open: boolean;
	handleClose: () => void;
	mode: 'create' | 'edit';
	selectedUnitType?: UnitTypeEntity | null;
}

export default function UnitTypesModal({ open, handleClose, mode, selectedUnitType }: UnitTypesModalProps) {
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
				<UnitTypesForm
					mode={mode}
					data={selectedUnitType}
					onCancel={handleClose}
					onSuccess={handleClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
