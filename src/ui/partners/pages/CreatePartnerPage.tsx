import { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router';
import FusePageSimple from '@fuse/core/FusePageSimple';
import {
	Typography,
	Button,
	ToggleButton,
	ToggleButtonGroup,
	Chip,
	useTheme
} from '@mui/material';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Save } from '@mui/icons-material';

import { partnerSchema, PartnerFormType } from '@/schemas/partners/partners.schema';
import { defaultCreatePartnerValues } from '@/schemas/partners/partners.defaults';

import { useCreatePartner } from '@/features/partners/hooks/useCreatePartner';
import useIndexPaymentMethods from '@/features/payment_methods/hooks/useIndexPaymentMethods';
import { CreatePartnerDTO } from '@/domain/entities/partners/DTOs/PartnerDTOs';
import useActiveCompany from '@/features/companies/useActiveCompany';
import { useIndexTaxRates } from '@/features/tax_rates/hooks/useIndexTaxRates';

import { mapPartnerFormToDTO } from '@/ui/partners/components/forms/PartnerForm.utils';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PublicOrganismModal, { PublicOrganism } from '../components/modals/PublicOrganismModal';
import useIndexCurrencies from '@/features/currencies/hooks/useIndexCurrencies';

import { PartnerHeaderSection } from '@/ui/partners/components/forms/sections/PartnerHeaderSection';
import { PartnerContactSection } from '@/ui/partners/components/forms/sections/PartnerContactSection';
import { PartnerBankAccountsSection } from '@/ui/partners/components/forms/sections/PartnerBankAccountsSection';
import { PartnerFinancialSection } from '@/ui/partners/components/forms/sections/PartnerFinancialSection';

function CreatePartnerPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const theme = useTheme();
	const { handleCreatePartner, isLoading: isCreating } = useCreatePartner();
	const { paymentMethods } = useIndexPaymentMethods();
	const activeCompany = useActiveCompany();
	const { data: taxRates } = useIndexTaxRates();
	const { currencies } = useIndexCurrencies();

	const [publicOrganisms, setPublicOrganisms] = useState<PublicOrganism[]>([]);
	const [organismModalOpen, setOrganismModalOpen] = useState(false);

	const methods = useForm<PartnerFormType>({
		mode: 'onChange',
		resolver: zodResolver(partnerSchema),
		defaultValues: { ...defaultCreatePartnerValues, name: searchParams.get('name') || '' }
	});

	const {
		control,
		handleSubmit,
		formState: { isValid }
	} = methods;

	const watchedType = useWatch({ control, name: 'type' });

	// Auto-open organism modal when switching to public_organism
	useEffect(() => {
		if (watchedType === 'public_organism') {
			setOrganismModalOpen(true);
		}
	}, [watchedType]);

	const onCancel = () => {
		navigate(-1);
	};

	const onSubmit = async (values: PartnerFormType) => {
		if (!activeCompany?.id) {
			console.error('No active company found');
			return;
		}

		const dto = mapPartnerFormToDTO(values, activeCompany.id);

		try {
			const response = await handleCreatePartner(dto as CreatePartnerDTO);
			console.log('partner created', response);

			if (response.partner.id) {
				navigate(`/partners/${response.partner.id}`);
			} else {
				navigate(-1);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const isLoading = isCreating;

	return (
		<>
			<FusePageSimple
				header={
					<div className="bg-background-default flex w-full flex-1 flex-col items-center justify-between space-y-2 border-b p-6 sm:flex-row sm:space-y-0 sm:px-8">
						<div className="flex flex-col items-start">
							<PageBreadcrumb className="mb-4" />
							<div className="flex items-center gap-3">
								<Button
									className="text-text-secondary hover:text-text-primary h-8 w-8 min-w-0 rounded-full p-0"
									onClick={onCancel}
								>
									<FuseSvgIcon>heroicons-outline:arrow-left</FuseSvgIcon>
								</Button>
								<div>
									<Typography
										variant="h2"
										className="text-text-primary text-2xl font-bold tracking-tight"
									>
										Nuevo Socio
									</Typography>
									<Typography
										variant="body2"
										className="text-text-secondary"
									>
										Complete la información para registrar un nuevo socio en el sistema.
									</Typography>
								</div>
							</div>
						</div>
						<div className="flex gap-3">
							<Button
								variant="text"
								color="inherit"
								onClick={onCancel}
								disabled={isLoading}
								className="px-4"
							>
								Cancelar
							</Button>
							<Button
								onClick={handleSubmit(onSubmit)}
								variant="contained"
								color="secondary"
								disabled={!isValid || isLoading}
								startIcon={isLoading ? undefined : <Save />}
								className="px-6 shadow-none hover:shadow-sm"
							>
								{isLoading ? 'Guardando...' : 'Guardar Socio'}
							</Button>
						</div>
					</div>
				}
				content={
					<div className="mx-auto w-full max-w-5xl p-8">
						<FormProvider {...methods}>
							<form className="flex flex-col gap-8">
								{/* SECTION 1: GENERAL INFO */}
								<div className="flex flex-col gap-6">
									<div className="flex items-center justify-between border-b pb-2">
										<Typography
											variant="h6"
											className="text-text-primary text-lg font-semibold"
										>
											Información General
										</Typography>
										<Chip
											label="Datos Principales"
											size="small"
											variant="outlined"
											className="text-text-secondary border-divider"
										/>
									</div>

									<PartnerHeaderSection
										isLoading={isLoading}
										publicOrganisms={publicOrganisms}
										onOpenOrganismModal={() => setOrganismModalOpen(true)}
									/>

									<div className="col-span-12 pt-2">
										<Typography
											variant="subtitle2"
											className="text-text-secondary mb-3 font-medium"
										>
											Rol del Socio
										</Typography>
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
													className="overflow-hidden rounded-md border"
													sx={{
														'& .MuiToggleButton-root': {
															border: 'none',
															borderRadius: 0,
															px: 3,
															py: 1,
															textTransform: 'none',
															fontWeight: 500,
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
													<ToggleButton value="client_supplier">
														Cliente / Proveedor
													</ToggleButton>
													<ToggleButton value="prospect">Prospecto</ToggleButton>
												</ToggleButtonGroup>
											)}
										/>
									</div>
								</div>

								{/* SECTION 2: CONTACT & ADDRESS */}
								<div className="border-t border-dashed pt-6">
									<PartnerContactSection isLoading={isLoading} />
								</div>

								{/* SECTION 3: BANK ACCOUNTS */}
								<div className="border-t border-dashed pt-6">
									<PartnerBankAccountsSection isLoading={isLoading} />
								</div>

								{/* SECTION 4: FINANCIAL & TAXES */}
								<div className="border-t border-dashed pt-6">
									<div className="mb-6 flex items-center justify-between border-b pb-2">
										<Typography
											variant="h6"
											className="text-text-primary text-lg font-semibold"
										>
											Datos Financieros & Impuestos
										</Typography>
									</div>
									<PartnerFinancialSection
										isLoading={isLoading}
										paymentMethods={paymentMethods || []}
										currencies={currencies || []}
										taxRates={taxRates || []}
									/>
								</div>
							</form>
						</FormProvider>
					</div>
				}
				scroll="content"
			/>
			<PublicOrganismModal
				open={organismModalOpen}
				onClose={() => setOrganismModalOpen(false)}
				organisms={publicOrganisms}
				onOrganismsChange={setPublicOrganisms}
			/>
		</>
	);
}

export default CreatePartnerPage;
