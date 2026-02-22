import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import { Box, TextField, Stack, Typography, Button } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps, accordionSummaryClasses } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ArrowForwardIosSharp, Add, ContactPhone, Email, Phone } from '@mui/icons-material';
import { CompanySettingsForm } from '../pages/SettingPage';

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

export default function ContactsTab({ isEditing }: { isEditing: boolean }) {
	const {
		control,
		formState: { errors }
	} = useFormContext<CompanySettingsForm>();
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'contacts'
	});

	const [expanded, setExpanded] = React.useState<number | false>(0);

	const handleChange = (panel: number) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	return (
		<Box>
			{/* Header */}
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
						Contactos de la Empresa
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Canales de comunicación principal
					</Typography>
				</Box>
				<Button
					variant="contained"
					startIcon={<Add />}
					onClick={() => {
						append({ email: '', phone: '' });
						setExpanded(fields.length);
					}}
					size="small"
					disabled={!isEditing}
				>
					Agregar Contacto
				</Button>
			</Stack>

			{/* Accordion List */}
			{fields.length > 0 ? (
				<Box>
					{fields.map((field, index) => (
						<Accordion
							key={field.id}
							expanded={expanded === index}
							onChange={handleChange(index)}
						>
							<AccordionSummary
								aria-controls={`contact-${index}-content`}
								id={`contact-${index}-header`}
							>
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
											{field.email || field.phone || `Contacto ${index + 1}`}
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
								</Stack>
							</AccordionSummary>

							<AccordionDetails>
								<Stack spacing={3}>
									<Stack
										direction={{ xs: 'column', md: 'row' }}
										spacing={2}
									>
										<Controller
											name={`contacts.${index}.email`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Correo Electrónico"
													placeholder="contacto@empresa.com"
													type="email"
													error={!!errors.contacts?.[index]?.email}
													helperText={errors.contacts?.[index]?.email?.message}
													fullWidth
													variant="filled"
													disabled={!isEditing}
												/>
											)}
										/>
										<Controller
											name={`contacts.${index}.phone`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Teléfono"
													placeholder="+54 11 1234-5678"
													type="tel"
													error={!!errors.contacts?.[index]?.phone}
													helperText={errors.contacts?.[index]?.phone?.message}
													fullWidth
													variant="filled"
													disabled={!isEditing}
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
						p: 6,
						textAlign: 'center',
						border: '1px dashed',
						borderColor: 'divider',
						borderRadius: 2,
						bgcolor: 'background.paper'
					}}
				>
					<ContactPhone sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
					<Typography
						color="text.secondary"
						gutterBottom
					>
						No hay contactos registrados
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Agrega un contacto para tu empresa
					</Typography>
				</Box>
			)}
		</Box>
	);
}
