import { Dialog, DialogContent } from '@mui/material';
import UpdateNumberSeriesForm from '../forms/UpdateNumberSeriesForm';
import useIndexDocumentTypesByCategory from '@/features/document_types/hooks/useIndexDocumentTypesByCategory';
import { NumberSeriesEntity } from '@/domain/entities/number_series/NumberSeriesEntity';

interface UpdateNumberSeriesModalProps {
	open: boolean;
	onClose: () => void;
	numberSeries: NumberSeriesEntity | null;
}

export default function UpdateNumberSeriesModal({ open, onClose, numberSeries }: UpdateNumberSeriesModalProps) {
	const { documentTypes, isLoading } = useIndexDocumentTypesByCategory('sales');

	if (!numberSeries) return null;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
		>
			<DialogContent>
				<UpdateNumberSeriesForm
					numberSeries={numberSeries}
					onCancel={onClose}
					onSuccess={onClose}
					documentTypes={documentTypes}
					isLoadingDocumentTypes={isLoading}
				/>
			</DialogContent>
		</Dialog>
	);
}
