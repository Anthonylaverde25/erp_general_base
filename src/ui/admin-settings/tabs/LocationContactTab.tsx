import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import { Box, TextField, Stack, Typography, Button, Divider, IconButton, Chip } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps, accordionSummaryClasses } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ArrowForwardIosSharp, Add, LocationOn, ContactPhone, Email, Phone } from '@mui/icons-material';
import { CompanySettingsForm } from '../pages/SettingPage';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import CreateAddressModal from '../../address/components/modals/CreateAddressModal';
import UpdateAddressModal from '../../address/components/modals/UpdateAddressModal';
import CreateContactModal from '../../contacts/components/modals/CreateContactModal';
import UpdateContactModal from '../../contacts/components/modals/UpdateContactModal';
import HeaderDefaultAddress from '@/ui/address/components/HeaderDefaultAddress';
import HeaderDefaultContact from '../components/HeaderDefaultContact';

// Styled Accordion Components
const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion
		disableGutters
		elevation={0}
		square
		{...props}
	/>
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:not(:last-child)': {
		borderBottom: 0
	},
	'&::before': {
		display: 'none'
	}
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary
		expandIcon={<ArrowForwardIosSharp sx={{ fontSize: '0.9rem' }} />}
		{...props}
	/>
))(({ theme }) => ({
	backgroundColor: 'rgba(0, 0, 0, .03)',
	flexDirection: 'row-reverse',
	[`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
		transform: 'rotate(90deg)'
	},
	[`& .${accordionSummaryClasses.content}`]: {
		marginLeft: theme.spacing(1)
	},
	...theme.applyStyles('dark', {
		backgroundColor: 'rgba(255, 255, 255, .05)'
	})
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(3),
	borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

export default function LocationContactTab() {
	const {
		control,
		formState: { errors },
		getValues,
		setValue
	} = useFormContext<CompanySettingsForm>();

	const {
		fields: addressFields,
		append: appendAddress,
		replace: replaceAddress
	} = useFieldArray({
		control,
		name: 'addresses',
		keyName: 'fieldId'
	});

	const {
		fields: contactFields,
		append: appendContact,
		replace: replaceContact
	} = useFieldArray({
		control,
		name: 'contacts',
		keyName: 'fieldId'
	});

	// Sort addresses for display: Default address first
	const sortedAddressFields = React.useMemo(() => {
		return addressFields
			.map((field, index) => ({ field, originalIndex: index }))
			.sort((a, b) => {
				const aDef = !!a.field.default;
				const bDef = !!b.field.default;

				if (aDef === bDef) return 0;

				return aDef ? -1 : 1;
			});
	}, [addressFields]);

	// Sort contacts for display: Default contact first
	const sortedContactFields = React.useMemo(() => {
		return contactFields
			.map((field, index) => ({ field, originalIndex: index }))
			.sort((a, b) => {
				const aDef = !!a.field.default;
				const bDef = !!b.field.default;

				if (aDef === bDef) return 0;

				return aDef ? -1 : 1;
			});
	}, [contactFields]);

	const [expandedAddress, setExpandedAddress] = React.useState<number | false>(false);
	const [expandedContact, setExpandedContact] = React.useState<number | false>(false);

	// ... (keep state) ...

	const [openAddressModal, setOpenAddressModal] = React.useState(false);
	const [openUpdateAddressModal, setOpenUpdateAddressModal] = React.useState(false);
	const [selectedAddressId, setSelectedAddressId] = React.useState<number | null>(null);

	// Contact Modal State
	const [openCreateContactModal, setOpenCreateContactModal] = React.useState(false);
	const [openUpdateContactModal, setOpenUpdateContactModal] = React.useState(false);
	const [selectedContactId, setSelectedContactId] = React.useState<number | null>(null);

	// ... (keep handlers) ...

	const handleEditAddress = (id: number) => {
		console.log('Edit address ID', id);
		setSelectedAddressId(id);
		setOpenUpdateAddressModal(true);
	};

	const handleCloseUpdateModal = () => {
		setOpenUpdateAddressModal(false);
		setSelectedAddressId(null);
	};

	const handleEditContact = (id: number) => {
		console.log('Edit contact ID', id);
		setSelectedContactId(id);
		setOpenUpdateContactModal(true);
	};

	const handleCloseUpdateContactModal = () => {
		setOpenUpdateContactModal(false);
		setSelectedContactId(null);
	};

	const handleAddressChange = (panel: number) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
		setExpandedAddress(newExpanded ? panel : false);
	};

	const handleContactChange = (panel: number) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
		setExpandedContact(newExpanded ? panel : false);
	};

	const handleSetDefaultAddress = (id: number) => {
		// ... (keep implementation)
		const currentAddresses = getValues('addresses');
		const updatedAddresses = currentAddresses.map((addr: any) => ({
			...addr,
			default: addr.id === id
		}));
		replaceAddress(updatedAddresses);
	};

	const handleSetDefaultContact = (id: number) => {
		// ... (keep implementation)
		const currentContacts = getValues('contacts');
		const updatedContacts = currentContacts.map((contact: any) => ({
			...contact,
			default: contact.id === id
		}));
		replaceContact(updatedContacts);
	};

	return (
		<Box>
			{/* Addresses Section */}

			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				mb={3}
			>
				<Box>
					<Typography
						variant="h6"
						fontWeight={600}
					>
						Direcciones
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Ubicaciones y residencia fiscal
					</Typography>
				</Box>
				<Button
					className="btn-primary"
					variant="contained"
					color="primary"
					size="large"
					startIcon={<Add />}
					onClick={() => setOpenAddressModal(true)}
				>
					Agregar Dirección
				</Button>
			</Stack>

			{addressFields.length > 0 ? (
				<Box>
					<div className="mb-2">
						<HeaderDefaultAddress
							address={addressFields as any}
							onSetDefault={handleSetDefaultAddress}
						/>
					</div>
					{sortedAddressFields.map(({ field, originalIndex }, index) => (
						<Accordion
							key={(field as any).fieldId}
							expanded={expandedAddress === index}
							onChange={handleAddressChange(index)}
						>
							{/* ... (keep address accordion content) ... */}
							<AccordionSummary>
								<Stack
									direction="row"
									alignItems="center"
									spacing={2}
									sx={{ width: '100%', pr: 2 }}
								>
									<LocationOn
										color="primary"
										fontSize="small"
									/>
									<Box sx={{ flex: 1 }}>
										<Typography fontWeight={500}>
											{field.street || `Dirección ${originalIndex + 1}`}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											{[field.city, field.state, field.country].filter(Boolean).join(', ') ||
												'Sin detalles'}
										</Typography>
									</Box>
									{field.default && <Chip label="Dirección Principal" />}

									<IconButton
										size="small"
										onClick={(e) => {
											e.stopPropagation();
											const realId = getValues(`addresses.${originalIndex}.id`);
											handleEditAddress(realId);
										}}
										sx={{ ml: 1 }}
									>
										<FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>
									</IconButton>
								</Stack>
							</AccordionSummary>

							<AccordionDetails>
								<Stack spacing={3}>
									<Controller
										name={`addresses.${originalIndex}.street`}
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Calle y número"
												placeholder="Ej: Av. Libertador 1234"
												error={!!errors.addresses?.[originalIndex]?.street}
												helperText={errors.addresses?.[originalIndex]?.street?.message}
												fullWidth
												variant="filled"
												InputProps={{ readOnly: true }}
											/>
										)}
									/>

									<Stack
										direction={{ xs: 'column', md: 'row' }}
										spacing={2}
									>
										<Controller
											name={`addresses.${originalIndex}.city`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Ciudad"
													placeholder="Ciudad"
													error={!!errors.addresses?.[originalIndex]?.city}
													helperText={errors.addresses?.[originalIndex]?.city?.message}
													fullWidth
													variant="filled"
													InputProps={{ readOnly: true }}
												/>
											)}
										/>
										<Controller
											name={`addresses.${originalIndex}.state`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Provincia / Estado"
													placeholder="Provincia"
													error={!!errors.addresses?.[originalIndex]?.state}
													helperText={errors.addresses?.[originalIndex]?.state?.message}
													fullWidth
													variant="filled"
													InputProps={{ readOnly: true }}
												/>
											)}
										/>
									</Stack>

									<Stack
										direction={{ xs: 'column', md: 'row' }}
										spacing={2}
									>
										<Controller
											name={`addresses.${originalIndex}.postal_code`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Código Postal"
													placeholder="CP"
													error={!!errors.addresses?.[originalIndex]?.postal_code}
													helperText={errors.addresses?.[originalIndex]?.postal_code?.message}
													fullWidth
													variant="filled"
													InputProps={{ readOnly: true }}
												/>
											)}
										/>
										<Controller
											name={`addresses.${originalIndex}.country`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="País"
													placeholder="País"
													error={!!errors.addresses?.[originalIndex]?.country}
													helperText={errors.addresses?.[originalIndex]?.country?.message}
													fullWidth
													variant="filled"
													InputProps={{ readOnly: true }}
												/>
											)}
										/>
									</Stack>

									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											Dirección {field.default ? 'principal' : 'secundaria'}
										</Typography>
									</Box>
								</Stack>
							</AccordionDetails>
						</Accordion>
					))}
				</Box>
			) : (
				<Box
					sx={{
						p: 4,
						textAlign: 'center',
						border: '1px dashed',
						borderColor: 'divider',
						borderRadius: 2,
						bgcolor: 'background.paper'
					}}
				>
					<LocationOn sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
					<Typography
						color="text.secondary"
						variant="body2"
					>
						No hay direcciones registradas
					</Typography>
				</Box>
			)}

			<Divider sx={{ my: 4 }} />

			{/* Contacts Section */}
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				mb={3}
			>
				<Box>
					<Typography
						variant="h6"
						fontWeight={600}
					>
						Contactos
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Canales de comunicación
					</Typography>
				</Box>
				<Button
					className="btn-primary"
					variant="contained"
					color="primary"
					size="large"
					startIcon={<Add />}
					onClick={() => setOpenCreateContactModal(true)}
				>
					Agregar Contacto
				</Button>
			</Stack>

			{contactFields.length > 0 ? (
				<Box>
					<div className="mb-2">
						<HeaderDefaultContact
							contacts={contactFields as any}
							onSetDefault={handleSetDefaultContact}
						/>
					</div>
					{sortedContactFields.map(({ field, originalIndex }, index) => (
						<Accordion
							key={(field as any).fieldId}
							expanded={expandedContact === index}
							onChange={handleContactChange(index)}
						>
							<AccordionSummary>
								<Stack
									direction="row"
									alignItems="center"
									spacing={2}
									sx={{ width: '100%', pr: 2 }}
								>
									<ContactPhone
										color="primary"
										fontSize="small"
									/>
									<Box sx={{ flex: 1 }}>
										<Typography fontWeight={500}>
											{field.email || field.phone || `Contacto ${originalIndex + 1}`}
										</Typography>
										<Stack
											direction="row"
											spacing={2}
											alignItems="center"
										>
											{field.email && (
												<Stack
													direction="row"
													spacing={0.5}
													alignItems="center"
												>
													<Email sx={{ fontSize: 14, color: 'text.secondary' }} />
													<Typography
														variant="body2"
														color="text.secondary"
													>
														{field.email}
													</Typography>
												</Stack>
											)}
											{field.phone && (
												<Stack
													direction="row"
													spacing={0.5}
													alignItems="center"
												>
													<Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
													<Typography
														variant="body2"
														color="text.secondary"
													>
														{field.phone}
													</Typography>
												</Stack>
											)}
											{!field.email && !field.phone && (
												<Typography
													variant="body2"
													color="text.secondary"
												>
													Sin detalles
												</Typography>
											)}
										</Stack>
									</Box>
									{field.default && <Chip label="Contacto Principal" />}
									<IconButton
										size="small"
										onClick={(e) => {
											e.stopPropagation();
											const realId = getValues(`contacts.${originalIndex}.id`);
											handleEditContact(realId);
										}}
										sx={{ ml: 1 }}
									>
										<FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>
									</IconButton>
								</Stack>
							</AccordionSummary>

							<AccordionDetails>
								<Stack spacing={3}>
									<Stack
										direction={{ xs: 'column', md: 'row' }}
										spacing={2}
									>
										<Controller
											name={`contacts.${originalIndex}.email`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Correo Electrónico"
													placeholder="contacto@empresa.com"
													type="email"
													error={!!errors.contacts?.[originalIndex]?.email}
													helperText={errors.contacts?.[originalIndex]?.email?.message}
													fullWidth
													variant="filled"
													InputProps={{ readOnly: true }}
												/>
											)}
										/>
										<Controller
											name={`contacts.${originalIndex}.phone`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Teléfono"
													placeholder="+54 11 1234-5678"
													type="tel"
													error={!!errors.contacts?.[originalIndex]?.phone}
													helperText={errors.contacts?.[originalIndex]?.phone?.message}
													fullWidth
													variant="filled"
													InputProps={{ readOnly: true }}
												/>
											)}
										/>
									</Stack>
								</Stack>
							</AccordionDetails>
						</Accordion>
					))}
				</Box>
			) : (
				<Box
					sx={{
						p: 4,
						textAlign: 'center',
						border: '1px dashed',
						borderColor: 'divider',
						borderRadius: 2,
						bgcolor: 'background.paper'
					}}
				>
					<ContactPhone sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
					<Typography
						color="text.secondary"
						variant="body2"
					>
						No hay contactos registrados
					</Typography>
				</Box>
			)}

			{/* ADDRESS MODALS */}
			<CreateAddressModal
				open={openAddressModal}
				onClose={() => setOpenAddressModal(false)}
				onSubmit={(data) => {
					appendAddress(data);
					setTimeout(() => {
						setExpandedAddress(addressFields.length);
					}, 0);
				}}
			/>
			<UpdateAddressModal
				open={openUpdateAddressModal}
				onClose={handleCloseUpdateModal}
				addressId={selectedAddressId}
				onSubmit={(data) => {
					handleCloseUpdateModal();
				}}
			/>

			{/* CONTACT MODALS */}
			<CreateContactModal
				open={openCreateContactModal}
				onClose={() => setOpenCreateContactModal(false)}
				onSubmit={(data) => {
					appendContact(data);
					setTimeout(() => {
						setExpandedContact(contactFields.length);
					}, 0);
				}}
			/>
			<UpdateContactModal
				open={openUpdateContactModal}
				onClose={handleCloseUpdateContactModal}
				contactId={selectedContactId}
				onSubmit={(data) => {
					handleCloseUpdateContactModal();
				}}
			/>
		</Box>
	);
}
