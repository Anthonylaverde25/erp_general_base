import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AddressForm from '../forms/AddressForm';
import { useCreateAddressToCompany } from '@/features/companies/hooks/useCreateAddressToCompany';
import useActiveCompany from '@/features/companies/useActiveCompany';
import { CreateAddressDTO } from '@/domain/entities/addresses/DTOs/CreateAddressDTO';

const addressSchema = z.object({
	street: z.string().min(1, 'La calle es requerida'),
	city: z.string().min(1, 'La ciudad es requerida'),
	state: z.string().min(1, 'La provincia es requerida'),
	postal_code: z.string().min(1, 'El código postal es requerido'),
	country: z.string().min(1, 'El país es requerido'),
	default: z.boolean().default(false)
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface CreateAddressModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: AddressFormData) => void;
}

export default function CreateAddressModal({ open, onClose, onSubmit }: CreateAddressModalProps) {
	const activeCompany = useActiveCompany();
	const companyId = activeCompany?.id;
	const { handleCreateAddressToCompany: createAddress } = useCreateAddressToCompany();

	const methods = useForm<AddressFormData>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			street: '',
			city: '',
			state: '',
			postal_code: '',
			country: '',
			default: false
		}
	});

	const { handleSubmit, reset } = methods;

	const handleFormSubmit = async (data: CreateAddressDTO) => {
		if (!companyId) return;

		try {
			await createAddress(companyId, data);
			onSubmit(data); // This might be redundant if the hook invalidates query and parent re-fetches, but LocationContactTab appends locally.
			// If we rely on invalidateQueries, we might not need to append (or append is optimistic).
			// However, the existing implementation appends to field array.
			// Ideally we should refetch or optimistically update.
			// Given the parent uses useFieldArray which is local state derived initially from props but then independent,
			// if we just invalidate, the parent state won't update unless it listens to props changes again (useEffect in SettingPage handles reset).
			// So appending locally is fine for immediate feedback, and invalidation updates the source of truth.

			reset();
			onClose();
		} catch (error) {
			console.error(error);
		}
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: { borderRadius: 2 }
			}}
		>
			<DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
				<Box>
					<Typography
						variant="h6"
						component="div"
						fontWeight={600}
					>
						Nueva Dirección
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Agregue una nueva ubicación física o dirección fiscal para su empresa
					</Typography>
				</Box>
				<IconButton
					aria-label="close"
					onClick={handleClose}
					sx={{
						color: (theme) => theme.palette.grey[500],
						mt: 0.5
					}}
				>
					<Close />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<Box sx={{ mt: 1 }}>
					<FormProvider {...methods}>
						<form
							id="create-address-form"
							onSubmit={handleSubmit(handleFormSubmit)}
						>
							<AddressForm />
						</form>
					</FormProvider>
				</Box>
			</DialogContent>

			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button
					onClick={handleClose}
					color="inherit"
				>
					Cancelar
				</Button>
				<Button
					type="submit"
					form="create-address-form"
					variant="contained"
					color="primary"
				>
					Agregar Dirección
				</Button>
			</DialogActions>
		</Dialog>
	);
}
