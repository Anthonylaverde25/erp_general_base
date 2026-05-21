import { useEffect, useState, SyntheticEvent } from 'react';
import { useForm, FormProvider, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Typography,
	Box,
	Tabs,
	Tab,
	Divider,
	Button,
	ToggleButton,
	ToggleButtonGroup,
	Stack,
	Fade,
	IconButton
} from '@mui/material';

import { Save, Close, Person, AccountBalance, Settings } from '@mui/icons-material';

import { partnerSchema, PartnerFormType } from '@/schemas/partners/partners.schema';
import { defaultCreatePartnerValues, defaultUpdatePartnerValues } from '@/schemas/partners/partners.defaults';
import PartnerFormTabPanel from '@/ui/partners/components/PartnerFormTabPanel';

import { useCreatePartner } from '@/features/partners/hooks/useCreatePartner';
import { useUpdatePartner } from '@/features/partners/hooks/useUpdatePartner';
import useIndexPaymentMethods from '@/features/payment_methods/hooks/useIndexPaymentMethods';
import { CreatePartnerDTO, UpdatePartnerDTO } from '@/domain/entities/partners/DTOs/PartnerDTOs';
import useActiveCompany from '@/features/companies/useActiveCompany';
import { useIndexTaxRates } from '@/features/tax_rates/hooks/useIndexTaxRates';
import useIndexCurrencies from '@/features/currencies/hooks/useIndexCurrencies';

import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { mapPartnerFormToDTO } from './PartnerForm.utils';
import PublicOrganismModal, { PublicOrganism } from '../modals/PublicOrganismModal';

import { PartnerHeaderSection } from './sections/PartnerHeaderSection';
import { PartnerContactSection } from './sections/PartnerContactSection';
import { PartnerBankAccountsSection } from './sections/PartnerBankAccountsSection';
import { PartnerFinancialSection } from './sections/PartnerFinancialSection';

interface PartnersFormProps {
	data?: PartnerEntity | null;
	onCancel: () => void;
	onSuccess?: () => void;
}

export function PartnersForm({ data, onCancel, onSuccess }: PartnersFormProps) {
	const { handleCreatePartner, isLoading: isCreating } = useCreatePartner();
	const { handleUpdatePartner, isLoading: isUpdating } = useUpdatePartner();
	const { paymentMethods } = useIndexPaymentMethods();
	const activeCompany = useActiveCompany();
	const [tabValue, setTabValue] = useState(0);
	const { data: taxRates } = useIndexTaxRates();
	const { currencies } = useIndexCurrencies();
	const [publicOrganisms, setPublicOrganisms] = useState<PublicOrganism[]>([]);
	const [organismModalOpen, setOrganismModalOpen] = useState(false);

	const methods = useForm<PartnerFormType>({
		mode: 'onChange',
		resolver: zodResolver(partnerSchema),
		defaultValues: defaultCreatePartnerValues
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { isValid }
	} = methods;

	const watchedType = useWatch({ control, name: 'type' });

	useEffect(() => {
		if (data) {
			reset(defaultUpdatePartnerValues(data));
		}
	}, [data, reset]);

	useEffect(() => {
		if (watchedType === 'public_organism') {
			setOrganismModalOpen(true);
		}
	}, [watchedType]);

	const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const onSubmit = async (values: PartnerFormType) => {
		if (!activeCompany?.id) return;

		const dto = mapPartnerFormToDTO(values, activeCompany.id);

		try {
			if (data) {
				await handleUpdatePartner(data.id, dto as UpdatePartnerDTO);
			} else {
				await handleCreatePartner(dto as CreatePartnerDTO);
			}

			onSuccess?.();
			onCancel();
		} catch (error) {
			console.error(error);
		}
	};

	function a11yProps(index: number) {
		return {
			id: `partner-tab-${index}`,
			'aria-controls': `partner-tabpanel-${index}`
		};
	}

	const isLoading = isCreating || isUpdating;

	return (
		<>
			<Fade in={true}>
				<div>
					<FormProvider {...methods}>
						<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex h-[700px] flex-col"
					>
							<Box className="flex-none p-6 pb-2 flex items-center justify-between">
								<Box>
									<Typography
										variant="h6"
										fontWeight={700}
										color="text.primary"
									>
										{data ? 'Editar Socio' : 'Crear Socio'}
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										{data
											? 'Actualice los detalles del socio.'
											: 'Introduzca los detalles del nuevo socio.'}
									</Typography>
								</Box>
								<IconButton
									onClick={onCancel}
									disabled={isLoading}
									size="small"
									aria-label="close"
								>
									<Close fontSize="small" />
								</IconButton>
							</Box>

						<Box className="flex-none px-6 py-2">
							<PartnerHeaderSection
								isLoading={isLoading}
								publicOrganisms={publicOrganisms}
								onOpenOrganismModal={() => setOrganismModalOpen(true)}
							/>
						</Box>

						<Box
							sx={{ px: 3, mt: 2, mb: 1 }}
							className="flex items-center justify-between"
						>
							<Tabs
								value={tabValue}
								onChange={handleTabChange}
								aria-label="partner settings tabs"
								sx={{
									minHeight: 40,
									'& .MuiTab-root': {
										minHeight: 40,
										py: 1,
										fontSize: '0.8125rem',
										textTransform: 'none',
										fontWeight: 600,
										gap: 1
									}
								}}
							>
								<Tab
									icon={<Person fontSize="small" />}
									iconPosition="start"
									label="Principal"
									{...a11yProps(0)}
								/>
								<Tab
									icon={<AccountBalance fontSize="small" />}
									iconPosition="start"
									label="Cuentas"
									{...a11yProps(1)}
								/>
								<Tab
									icon={<Settings fontSize="small" />}
									iconPosition="start"
									label="Preferencias"
									{...a11yProps(2)}
								/>
							</Tabs>

							<Controller
								name="role"
								control={control}
								render={({ field }) => (
									<ToggleButtonGroup
										{...field}
										exclusive
										onChange={(_e, value) => value && field.onChange(value)}
										disabled={isLoading}
										size="small"
										sx={{
											height: 32,
											'& .MuiToggleButton-root': {
												px: 1.5,
												fontSize: '0.75rem',
												fontWeight: 500,
												textTransform: 'none',
												border: '1px solid',
												borderColor: 'divider',
												color: 'text.secondary',
												'&.Mui-selected': {
													bgcolor: 'secondary.main',
													color: 'secondary.contrastText',
													'&:hover': {
														bgcolor: 'secondary.dark'
													}
												}
											}
										}}
									>
										<ToggleButton value="client">Cliente</ToggleButton>
										<ToggleButton value="supplier">Proveedor</ToggleButton>
										<ToggleButton value="client_supplier">Cliente/Proveedor</ToggleButton>
										<ToggleButton value="prospect">Prospecto</ToggleButton>
									</ToggleButtonGroup>
								)}
							/>
						</Box>

						<Divider />

						<Box className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-transparent">
							<PartnerFormTabPanel
								value={tabValue}
								index={0}
							>
								<PartnerContactSection isLoading={isLoading} />
							</PartnerFormTabPanel>

							<PartnerFormTabPanel
								value={tabValue}
								index={1}
							>
								<PartnerBankAccountsSection isLoading={isLoading} />
							</PartnerFormTabPanel>

							<PartnerFormTabPanel
								value={tabValue}
								index={2}
							>
								<PartnerFinancialSection
									isLoading={isLoading}
									paymentMethods={paymentMethods || []}
									currencies={currencies || []}
									taxRates={taxRates || []}
								/>
							</PartnerFormTabPanel>
						</Box>

						<Divider />

						<Stack
							direction="row"
							spacing={2}
							justifyContent="flex-end"
							className="border-divider border-t bg-gray-50 px-6 py-4 dark:bg-gray-900"
						>
							<Button
								variant="outlined"
								color="inherit"
								onClick={onCancel}
								disabled={isLoading}
								startIcon={<Close />}
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								variant="contained"
								color="secondary"
								disabled={!isValid || isLoading}
								startIcon={isLoading ? undefined : <Save />}
							>
								{isLoading ? 'Guardando...' : data ? 'Actualizar' : 'Crear Socio'}
							</Button>
						</Stack>
						</form>
					</FormProvider>
				</div>
			</Fade>

			<PublicOrganismModal
				open={organismModalOpen}
				onClose={() => setOrganismModalOpen(false)}
				organisms={publicOrganisms}
				onOrganismsChange={setPublicOrganisms}
			/>
		</>
	);
}
