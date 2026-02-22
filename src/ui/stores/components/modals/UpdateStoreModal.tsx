import { AppFormModal } from '@/components/modals/AppFormModal';
import UpdateStoreForm from '../forms/UpdateStoreForm';

interface UpdateStoreModalProps {
	open: boolean;
	onClose: () => void;
	storeId: number;
}

export default function UpdateStoreModal({ open, onClose, storeId }: UpdateStoreModalProps) {
	return (
		<AppFormModal
			isOpen={open}
			onClose={onClose}
			title="Editar Almacén"
			maxWidth="sm"
			hideCancel
			actions={<></>}
		>
			<div className="p-0">
				<UpdateStoreForm
					storeId={storeId}
					onCancel={onClose}
					onSuccess={onClose}
				/>
			</div>
		</AppFormModal>
	);
}
