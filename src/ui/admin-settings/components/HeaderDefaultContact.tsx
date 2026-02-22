import { useState } from 'react';
import { IContact } from '@/types/company.types';
import { Stack, Typography, Button, Box } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Email, Phone } from '@mui/icons-material';
import SelectDefaultContactModal from '@/ui/admin-settings/components/modals/SelectDefaultContactModal';

type Props = {
	contacts: IContact[];
	onSetDefault: (id: number) => void;
};

export default function HeaderDefaultContact({ contacts, onSetDefault }: Props) {
	const [modalOpen, setModalOpen] = useState(false);
	// Tomamos el primer contacto como "Default" o "Principal" de manera estática
	const defaultContact = contacts.find((c) => c.default);

	const handleSelect = (id: number) => {
		onSetDefault(id);
		setModalOpen(false);
	};

	if (!defaultContact) {
		return (
			<>
				<Stack
					className="flex justify-between"
					direction="row"
					alignItems="center"
					spacing={2}
					sx={{
						p: 2,
						borderRadius: 1,
						border: 1,
						borderColor: 'divider',
						borderLeftWidth: 4,
						borderLeftColor: 'warning.main',
						bgcolor: 'background.paper',
						boxShadow: 0
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<FuseSvgIcon
							size={24}
							color="warning"
						>
							heroicons-outline:exclamation-triangle
						</FuseSvgIcon>
						<Box>
							<Typography
								variant="subtitle2"
								fontWeight={600}
								color="text.primary"
							>
								Atención
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
							>
								Es necesario establecer un contacto por defecto.
							</Typography>
						</Box>
					</Box>
					<Button
						variant="outlined"
						size="small"
						color="inherit"
						startIcon={<FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>}
						onClick={() => setModalOpen(true)}
						sx={{
							alignSelf: { xs: 'flex-start', sm: 'center' },
							whiteSpace: 'nowrap',
							borderColor: 'divider'
						}}
					>
						Establecer
					</Button>
				</Stack>

				<SelectDefaultContactModal
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					items={contacts}
					currentDefaultId={defaultContact?.id}
					onSelect={handleSelect}
				/>
			</>
		);
	}

	const { email, phone } = defaultContact;

	return (
		<>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				alignItems="stretch"
				justifyContent="space-between"
				spacing={2}
				sx={{
					p: 2,
					borderRadius: 1,
					border: 1,
					borderColor: 'divider',
					borderLeftWidth: 4,
					borderLeftColor: 'primary.main',
					bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.50' : 'background.default')
				}}
			>
				{/* Bloque contacto */}
				<Stack spacing={0.5}>
					{/* Info Principal */}
					<Stack
						spacing={0.5}
						sx={{ mt: 1 }}
					>
						{email && (
							<Stack
								direction="row"
								spacing={1}
								alignItems="center"
							>
								<Email sx={{ fontSize: 16, color: 'text.secondary' }} />
								<Typography
									variant="body1"
									fontWeight={600}
									lineHeight={1.4}
								>
									{email}
								</Typography>
							</Stack>
						)}

						{phone && (
							<Stack
								direction="row"
								spacing={1}
								alignItems="center"
							>
								<Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
								<Typography
									variant="body2"
									color="text.secondary"
									lineHeight={1.4}
								>
									{phone}
								</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>

				{/* Acción - Opcional, similar a HeaderDefaultAddress */}
				<Button
					variant="outlined"
					size="small"
					color="inherit"
					startIcon={<FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>}
					onClick={() => setModalOpen(true)}
					sx={{
						alignSelf: { xs: 'flex-start', sm: 'center' },
						whiteSpace: 'nowrap',
						borderColor: 'divider'
					}}
				>
					Cambiar
				</Button>
			</Stack>

			<SelectDefaultContactModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				items={contacts}
				currentDefaultId={defaultContact?.id}
				onSelect={handleSelect}
			/>
		</>
	);
}
