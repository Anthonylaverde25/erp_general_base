import { Dialog, DialogContent } from '@mui/material';
import { TaxRatesForm } from '../forms/TaxRatesForm';
import { TaxRateEntity } from '@/domain/entities/tax_rates/TaxRateEntity';

interface TaxRatesModalProps {
	isOpen: boolean;
	onClose: () => void;
	data?: TaxRateEntity | null;
}

export function TaxRatesModal({ isOpen, onClose, data }: TaxRatesModalProps) {
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
		>
			<DialogContent>
				<TaxRatesForm
					data={data}
					onCancel={onClose}
					onSuccess={onClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
