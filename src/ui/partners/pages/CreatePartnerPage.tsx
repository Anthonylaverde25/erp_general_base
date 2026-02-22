import { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import FusePageSimple from '@fuse/core/FusePageSimple';
import {
	TextField,
	MenuItem,
	Typography,
	Box,
	Button,
	ToggleButton,
	ToggleButtonGroup,
	Checkbox,
	Chip,
	useTheme,
	FormControlLabel,
	Switch
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

function CreatePartnerPage() {
	const navigate = useNavigate();
	const theme = useTheme();
	const { handleCreatePartner, isLoading: isCreating } = useCreatePartner();
	const { paymentMethods } = useIndexPaymentMethods();
	const activeCompany = useActiveCompany();
	const { data: taxRates } = useIndexTaxRates();
	const { currencies } = useIndexCurrencies();

	const [publicOrganisms, setPublicOrganisms] = useState<PublicOrganism[]>([]);
	const [organismModalOpen, setOrganismModalOpen] = useState(false);

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors, isValid }
	} = useForm<PartnerFormType>({
		mode: 'onChange',
		resolver: zodResolver(partnerSchema),
		defaultValues: defaultCreatePartnerValues
	});

	const {
		fields: bankAccountsFields,
		append: appendBankAccount,
		remove: removeBankAccount
	} = useFieldArray({
		control,
		name: 'bank_accounts'
	});

	const bankAccounts = useWatch({ control, name: 'bank_accounts' });
	const watchedRole = useWatch({ control, name: 'role' });
	const watchedType = useWatch({ control, name: 'type' });

	const showSaleTaxes = watchedRole === 'client' || watchedRole === 'client_supplier';
	const showPurchaseTaxes = watchedRole === 'supplier' || watchedRole === 'client_supplier';

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

	const textFieldProps = {
		fullWidth: true,
		variant: 'filled' as const
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

								<div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
									<div className="col-span-12 sm:col-span-8">
										<Controller
											name="name"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													label="Nombre Fiscal"
													error={!!errors.name}
													helperText={errors.name?.message}
													disabled={isLoading}
													required
												/>
											)}
										/>
									</div>
									<div className="col-span-12 sm:col-span-4">
										<Controller
											name="type"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													select
													label="Tipo de Socio"
													error={!!errors.type}
													helperText={errors.type?.message}
													disabled={isLoading}
												>
													<MenuItem value="person">Persona</MenuItem>
													<MenuItem value="company">Empresa</MenuItem>
													<MenuItem value="public_organism">Organismo Público</MenuItem>
													<MenuItem value="prospect">Prospecto</MenuItem>
												</TextField>
											)}
										/>
									</div>
									<div className="col-span-12 sm:col-span-4">
										<Controller
											name="comercial_name"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													label="Nombre Comercial"
													error={!!errors.comercial_name}
													helperText={errors.comercial_name?.message}
													disabled={isLoading}
												/>
											)}
										/>
									</div>
									<div className="col-span-12 sm:col-span-4">
										<Controller
											name="vat_number"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													label="NIF / VAT"
													error={!!errors.vat_number}
													helperText={errors.vat_number?.message}
													disabled={isLoading}
												/>
											)}
										/>
									</div>
									<div className="col-span-12 sm:col-span-4">
										<Controller
											name="cif"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													label="CIF"
													error={!!errors.cif}
													helperText={errors.cif?.message}
													disabled={isLoading}
												/>
											)}
										/>
									</div>

									{/* Switches & Organism Buttons */}
									<div className="col-span-12 flex flex-wrap items-center gap-6 pt-2">
										{watchedType === 'public_organism' && (
											<Chip
												icon={
													<FuseSvgIcon size={16}>
														heroicons-outline:building-library
													</FuseSvgIcon>
												}
												label={`${publicOrganisms.length} Organismo${publicOrganisms.length !== 1 ? 's' : ''}`}
												variant="outlined"
												color="secondary"
												onClick={() => setOrganismModalOpen(true)}
												sx={{ cursor: 'pointer', fontWeight: 500 }}
											/>
										)}

										<Controller
											name="credit_available"
											control={control}
											render={({ field }) => (
												<FormControlLabel
													control={
														<Switch
															checked={field.value ?? false}
															onChange={(e) => field.onChange(e.target.checked)}
															disabled={isLoading}
															color="primary"
															size="small"
														/>
													}
													label={
														<Typography
															variant="body2"
															fontWeight={500}
														>
															Crédito Disponible
														</Typography>
													}
												/>
											)}
										/>
										<Controller
											name="grouped_billing"
											control={control}
											render={({ field }) => (
												<FormControlLabel
													control={
														<Switch
															checked={field.value ?? false}
															onChange={(e) => field.onChange(e.target.checked)}
															disabled={isLoading}
															color="primary"
															size="small"
														/>
													}
													label={
														<Typography
															variant="body2"
															fontWeight={500}
														>
															Facturación Agrupada
														</Typography>
													}
												/>
											)}
										/>
									</div>

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
							</div>

							{/* SECTION 2: CONTACT & ADDRESS */}
							<div className="grid grid-cols-1 gap-12 border-t border-dashed pt-6 md:grid-cols-2">
								{/* Column 1: Contact */}
								<div className="flex flex-col gap-6">
									<div className="flex items-center justify-between border-b pb-2">
										<Typography
											variant="h6"
											className="text-text-primary text-lg font-semibold"
										>
											Datos de Contacto
										</Typography>
									</div>
									<div className="space-y-5">
										<Controller
											name="contact_email"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													label="Email"
													error={!!errors.contact_email}
													helperText={errors.contact_email?.message}
													disabled={isLoading}
												/>
											)}
										/>
										<Controller
											name="contact_phone"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													label="Teléfono"
													error={!!errors.contact_phone}
													helperText={errors.contact_phone?.message}
													disabled={isLoading}
												/>
											)}
										/>
										<Controller
											name="website"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													label="Sitio Web"
													error={!!errors.website}
													helperText={errors.website?.message}
													disabled={isLoading}
												/>
											)}
										/>
									</div>
								</div>

								{/* Column 2: Address */}
								<div className="flex flex-col gap-6">
									<div className="flex items-center justify-between border-b pb-2">
										<Typography
											variant="h6"
											className="text-text-primary text-lg font-semibold"
										>
											Dirección Fiscal
										</Typography>
									</div>
									<div className="grid grid-cols-1 gap-5 sm:grid-cols-12">
										<div className="col-span-12">
											<Controller
												name="address_street"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														{...textFieldProps}
														label="Dirección Completa"
														error={!!errors.address_street}
														helperText={errors.address_street?.message}
														disabled={isLoading}
													/>
												)}
											/>
										</div>
										<div className="col-span-12 sm:col-span-6">
											<Controller
												name="address_city"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														{...textFieldProps}
														label="Ciudad"
														error={!!errors.address_city}
														helperText={errors.address_city?.message}
														disabled={isLoading}
													/>
												)}
											/>
										</div>
										<div className="col-span-12 sm:col-span-6">
											<Controller
												name="address_postal_code"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														{...textFieldProps}
														label="C.P."
														error={!!errors.address_postal_code}
														helperText={errors.address_postal_code?.message}
														disabled={isLoading}
													/>
												)}
											/>
										</div>
										<div className="col-span-12 sm:col-span-6">
											<Controller
												name="address_state"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														{...textFieldProps}
														label="Provincia"
														error={!!errors.address_state}
														helperText={errors.address_state?.message}
														disabled={isLoading}
													/>
												)}
											/>
										</div>
										<div className="col-span-12 sm:col-span-6">
											<Controller
												name="address_country"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														{...textFieldProps}
														label="País"
														error={!!errors.address_country}
														helperText={errors.address_country?.message}
														disabled={isLoading}
													/>
												)}
											/>
										</div>
									</div>
								</div>
							</div>

							{/* SECTION 3: BANK ACCOUNTS */}
							<div className="border-t border-dashed pt-6">
								<div className="mb-6 flex items-center justify-between border-b pb-2">
									<Typography
										variant="h6"
										className="text-text-primary text-lg font-semibold"
									>
										Cuentas Bancarias
									</Typography>
									<Button
										variant="outlined"
										color="secondary"
										size="small"
										startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
										onClick={() =>
											appendBankAccount({
												name: '',
												account_holder: '',
												account_number: '',
												swift: ''
											})
										}
										disabled={isLoading}
										sx={{ textTransform: 'none' }}
									>
										Añadir Cuenta
									</Button>
								</div>

								<div className="space-y-4">
									{bankAccountsFields.length === 0 && (
										<div className="text-text-secondary rounded-lg border border-dashed border-gray-300 bg-gray-50 py-8 text-center italic dark:border-gray-700 dark:bg-gray-800">
											No hay cuentas bancarias registradas.
										</div>
									)}
									{bankAccountsFields.map((item, index) => {
										const isDefault = bankAccounts?.[index]?.is_default;
										return (
											<div
												key={item.id}
												className={`rounded-lg border p-5 transition-all duration-200 ${
													isDefault
														? 'border-primary/20 bg-blue-50/30'
														: 'border-divider bg-transparent'
												}`}
											>
												<div className="mb-4 flex items-center justify-between">
													<Controller
														name={`bank_accounts.${index}.is_default`}
														control={control}
														render={({ field }) => (
															<div
																className="group flex cursor-pointer items-center select-none"
																onClick={() => {
																	bankAccountsFields.forEach((_, i) =>
																		setValue(`bank_accounts.${i}.is_default`, false)
																	);
																	setValue(`bank_accounts.${index}.is_default`, true);
																	field.onChange(true);
																}}
															>
																<div
																	className={`mr-2 flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${field.value ? 'border-secondary bg-secondary' : 'group-hover:border-secondary border-gray-400 bg-transparent'}`}
																>
																	{field.value && (
																		<div className="h-1.5 w-1.5 rounded-full bg-white" />
																	)}
																</div>
																<span
																	className={`text-sm font-medium ${field.value ? 'text-secondary' : 'text-text-secondary group-hover:text-secondary'}`}
																>
																	{field.value
																		? 'Principal'
																		: 'Marcar como Principal'}
																</span>
															</div>
														)}
													/>
													<Button
														size="small"
														color="error"
														onClick={() => removeBankAccount(index)}
														className="min-w-0"
														disabled={isLoading}
													>
														<FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
													</Button>
												</div>
												<div className="grid grid-cols-1 gap-5 sm:grid-cols-12">
													<div className="col-span-12 sm:col-span-6">
														<Controller
															name={`bank_accounts.${index}.name`}
															control={control}
															render={({ field }) => (
																<TextField
																	{...field}
																	{...textFieldProps}
																	label="Banco / Entidad"
																	error={!!errors.bank_accounts?.[index]?.name}
																	helperText={
																		errors.bank_accounts?.[index]?.name?.message
																	}
																	disabled={isLoading}
																/>
															)}
														/>
													</div>
													<div className="col-span-12 sm:col-span-6">
														<Controller
															name={`bank_accounts.${index}.account_holder`}
															control={control}
															render={({ field }) => (
																<TextField
																	{...field}
																	{...textFieldProps}
																	label="Titular de la Cuenta"
																	error={
																		!!errors.bank_accounts?.[index]?.account_holder
																	}
																	helperText={
																		errors.bank_accounts?.[index]?.account_holder
																			?.message
																	}
																	disabled={isLoading}
																/>
															)}
														/>
													</div>
													<div className="col-span-12 sm:col-span-8">
														<Controller
															name={`bank_accounts.${index}.account_number`}
															control={control}
															render={({ field }) => (
																<TextField
																	{...field}
																	{...textFieldProps}
																	label="IBAN / Número de Cuenta"
																	error={
																		!!errors.bank_accounts?.[index]?.account_number
																	}
																	helperText={
																		errors.bank_accounts?.[index]?.account_number
																			?.message
																	}
																	disabled={isLoading}
																/>
															)}
														/>
													</div>
													<div className="col-span-12 sm:col-span-4">
														<Controller
															name={`bank_accounts.${index}.swift`}
															control={control}
															render={({ field }) => (
																<TextField
																	{...field}
																	{...textFieldProps}
																	label="SWIFT / BIC"
																	error={!!errors.bank_accounts?.[index]?.swift}
																	helperText={
																		errors.bank_accounts?.[index]?.swift?.message
																	}
																	disabled={isLoading}
																/>
															)}
														/>
													</div>
												</div>
											</div>
										);
									})}
								</div>
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

								<div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-12">
									<div className="col-span-12 sm:col-span-6">
										<Controller
											name="payment_method_id"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													select
													label="Método de Pago Predeterminado"
													error={!!errors.payment_method_id}
													helperText={errors.payment_method_id?.message}
													disabled={isLoading}
												>
													{paymentMethods?.map((pm: any) => (
														<MenuItem
															key={pm.id}
															value={String(pm.id)}
														>
															{pm.name}
														</MenuItem>
													))}
												</TextField>
											)}
										/>
									</div>
									<div className="col-span-12 sm:col-span-6">
										<Controller
											name="currency_id"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													select
													label="Moneda"
													disabled={isLoading}
												>
													<MenuItem value="">
														<em>Sin especificar</em>
													</MenuItem>
													{currencies?.map((currency) => (
														<MenuItem
															key={currency.id}
															value={String(currency.id)}
														>
															{currency.name} ({currency.symbol})
														</MenuItem>
													))}
												</TextField>
											)}
										/>
									</div>
								</div>

								{(showSaleTaxes || showPurchaseTaxes) && (
									<div className="pt-6">
										<Typography
											variant="subtitle2"
											fontWeight={600}
											className="text-text-primary mb-4 text-xs tracking-wide uppercase"
										>
											Configuración de Impuestos Aplicables
										</Typography>
										<div
											className={`grid gap-8 ${showSaleTaxes && showPurchaseTaxes ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}
										>
											{showSaleTaxes && (
												<div>
													<Typography
														variant="body2"
														fontWeight={500}
														className="text-text-secondary mb-2 flex items-center gap-2"
													>
														<FuseSvgIcon size={16}>heroicons-outline:tag</FuseSvgIcon>
														Ventas
													</Typography>
													<Controller
														name="sale_tax_ids"
														control={control}
														render={({ field }) => (
															<TextField
																{...textFieldProps}
																select
																label="Impuestos de Venta"
																disabled={isLoading}
																value={field.value || []}
																onChange={(e) => {
																	const val = e.target.value;
																	field.onChange(
																		typeof val === 'string'
																			? val.split(',').map(Number)
																			: val
																	);
																}}
																SelectProps={{
																	multiple: true,
																	renderValue: (selected) => (
																		<Box
																			sx={{
																				display: 'flex',
																				flexWrap: 'wrap',
																				gap: 0.5
																			}}
																		>
																			{(selected as number[]).map((id) => {
																				const tax = (taxRates || []).find(
																					(t) => t.id === id
																				);
																				return tax ? (
																					<Chip
																						key={id}
																						label={`${tax.name} (${tax.percentage}%)`}
																						size="small"
																						variant="outlined"
																						className="bg-white"
																					/>
																				) : null;
																			})}
																		</Box>
																	)
																}}
															>
																{(taxRates || []).map((tax) => (
																	<MenuItem
																		key={tax.id}
																		value={tax.id}
																	>
																		<Checkbox
																			checked={(field.value || []).includes(
																				tax.id
																			)}
																			size="small"
																		/>
																		{tax.name} ({tax.percentage}%)
																	</MenuItem>
																))}
															</TextField>
														)}
													/>
												</div>
											)}

											{showPurchaseTaxes && (
												<div>
													<Typography
														variant="body2"
														fontWeight={500}
														className="text-text-secondary mb-2 flex items-center gap-2"
													>
														<FuseSvgIcon size={16}>
															heroicons-outline:shopping-cart
														</FuseSvgIcon>
														Compras
													</Typography>
													<Controller
														name="purchase_tax_ids"
														control={control}
														render={({ field }) => (
															<TextField
																{...textFieldProps}
																select
																label="Impuestos de Compra"
																disabled={isLoading}
																value={field.value || []}
																onChange={(e) => {
																	const val = e.target.value;
																	field.onChange(
																		typeof val === 'string'
																			? val.split(',').map(Number)
																			: val
																	);
																}}
																SelectProps={{
																	multiple: true,
																	renderValue: (selected) => (
																		<Box
																			sx={{
																				display: 'flex',
																				flexWrap: 'wrap',
																				gap: 0.5
																			}}
																		>
																			{(selected as number[]).map((id) => {
																				const tax = (taxRates || []).find(
																					(t) => t.id === id
																				);
																				return tax ? (
																					<Chip
																						key={id}
																						label={`${tax.name} (${tax.percentage}%)`}
																						size="small"
																						variant="outlined"
																						className="bg-white"
																					/>
																				) : null;
																			})}
																		</Box>
																	)
																}}
															>
																{(taxRates || []).map((tax) => (
																	<MenuItem
																		key={tax.id}
																		value={tax.id}
																	>
																		<Checkbox
																			checked={(field.value || []).includes(
																				tax.id
																			)}
																			size="small"
																		/>
																		{tax.name} ({tax.percentage}%)
																	</MenuItem>
																))}
															</TextField>
														)}
													/>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						</form>
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
