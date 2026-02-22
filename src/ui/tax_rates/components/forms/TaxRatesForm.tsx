import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { taxRateSchema, TaxRateFormType } from '@/schemas/tax_rates/tax_rates.schema';
import { defaultTaxRateValues } from '@/schemas/tax_rates/tax_rates.defaults';
import { Button, TextField, MenuItem, Box, Typography, Divider, Stack, Fade } from '@mui/material';
import { Percent, Save, Close } from '@mui/icons-material';

import { useCreateTaxRate } from '@/features/tax_rates/hooks/useCreateTaxRate';
import { useUpdateTaxRate } from '@/features/tax_rates/hooks/useUpdateTaxRate';
import { TaxRateEntity } from '@/domain/entities/tax_rates/TaxRateEntity';
import useIndexTaxTypes from '@/features/tax_types/hooks/useIndexTaxTypes';
import { CreateTaxRateDTO } from '@/domain/entities/tax_rates/DTOs/CreateTaxRateDTO';

import { zodResolver } from '@hookform/resolvers/zod';

interface TaxRatesFormProps {
	data?: TaxRateEntity | null;
	onCancel: () => void;
	onSuccess?: () => void;
}

export function TaxRatesForm({ data, onCancel, onSuccess }: TaxRatesFormProps) {
	const createTaxRate = useCreateTaxRate();
	const updateTaxRate = useUpdateTaxRate();
	const { taxTypes } = useIndexTaxTypes();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid }
	} = useForm<TaxRateFormType>({
		mode: 'onChange',
		resolver: zodResolver(taxRateSchema),
		defaultValues: defaultTaxRateValues
	});

	useEffect(() => {
		if (data) {
			reset({
				name: data.name,
				percentage: Number(data.percentage),
				tax_type_id: data.tax_type_id
			});
		}
	}, [data, reset]);

	const onSubmit = (values: TaxRateFormType) => {
		if (data) {
			// 1. Convert form data to Domain Entity (applies business logic/validation)
			const updatedEntity = TaxRateEntity.update(data.id, values);

			// 2. Flatten Entity for Transport (Repository expects clean object)
			const updateData = updatedEntity.toPlainObject();

			updateTaxRate.mutate(
				{ id: data.id, data: updateData },
				{
					onSuccess: () => {
						onSuccess?.();
						onCancel();
					}
				}
			);
		} else {
			// 1. Convert form data to Domain Entity
			const newEntity = TaxRateEntity.create(values as any);

			// 2. Flatten Entity for Transport
			const createData: CreateTaxRateDTO = {
				name: newEntity.name,
				percentage: newEntity.percentage,
				tax_type_id: newEntity.tax_type_id
			};

			createTaxRate.mutate(createData, {
				onSuccess: () => {
					onSuccess?.();
					onCancel();
				}
			});
		}
	};

	const isLoading = createTaxRate.isPending || updateTaxRate.isPending;

	const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
		<Stack
			direction="row"
			spacing={1}
			alignItems="center"
			sx={{ mb: 2 }}
		>
			<Icon
				fontSize="small"
				color="primary"
			/>
			<Typography
				variant="subtitle1"
				fontWeight={600}
				color="text.primary"
			>
				{title}
			</Typography>
		</Stack>
	);

	return (
		<Fade
			in
			timeout={400}
		>
			<Box>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={4}>
						{/* Header */}
						<Box>
							<Typography
								variant="h5"
								fontWeight={700}
								gutterBottom
							>
								{data ? 'Edit Tax Rate' : 'Create New Tax Rate'}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
							>
								{data
									? 'Update the information for this tax rate.'
									: 'Complete the information to register a new tax rate in the system.'}
							</Typography>
						</Box>

						<Divider />

						{/* Tax Rate Information */}
						<Box>
							<SectionTitle
								icon={Percent}
								title="Tax Rate Information"
							/>

							<Stack spacing={3}>
								<Controller
									name="name"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											label="Name"
											placeholder="Ex: VAT 21%"
											error={!!errors.name}
											helperText={errors.name?.message}
											fullWidth
											variant="filled"
										/>
									)}
								/>

								<Controller
									name="percentage"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											label="Percentage (%)"
											type="number"
											placeholder="21"
											error={!!errors.percentage}
											helperText={errors.percentage?.message}
											fullWidth
											variant="filled"
											inputProps={{ step: '0.01' }}
										/>
									)}
								/>

								<Controller
									name="tax_type_id"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											select
											label="Tax Type"
											error={!!errors.tax_type_id}
											helperText={errors.tax_type_id?.message}
											fullWidth
											variant="filled"
											value={field.value || ''} // Ensure it's not undefined
											onChange={(e) => field.onChange(Number(e.target.value))}
											SelectProps={{
												MenuProps: {
													PaperProps: {
														sx: {
															maxHeight: 250
														}
													}
												}
											}}
										>
											{taxTypes?.map((type) => (
												<MenuItem
													key={type.id}
													value={type.id}
												>
													{type.name}
												</MenuItem>
											))}
										</TextField>
									)}
								/>
							</Stack>
						</Box>

						<Divider />

						{/* Buttons */}
						<Stack
							direction="row"
							spacing={2}
							justifyContent="flex-end"
						>
							<Button
								variant="text"
								color="inherit"
								startIcon={<Close />}
								onClick={onCancel}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								startIcon={<Save />}
								disabled={!isValid || isLoading}
							>
								{data ? 'Update Rate' : 'Create Rate'}
							</Button>
						</Stack>
					</Stack>
				</form>
			</Box>
		</Fade>
	);
}
