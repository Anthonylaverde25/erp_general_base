import React, { useEffect } from 'react';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { TextField, Button, Box, Typography, Divider, Stack, Fade, MenuItem } from '@mui/material';
import { Save, Close, Description, Tag } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import useCreateTaxType from '@/features/tax_types/hooks/useCreateTaxType';
import useUpdateTaxType from '@/features/tax_types/hooks/useUpdateTaxType';
import {
	createTaxTypeSchema,
	updateTaxTypeSchema,
	CreateTaxTypeFormType,
	UpdateTaxTypeFormType
} from '@/schemas/tax_types/tax_types.schema';
import { defaultCreateTaxTypeValues, defaultUpdateTaxTypeValues } from '@/schemas/tax_types/tax_types.defaults';
import { TaxTypeEntity } from '@/domain/entities/tax_types/TaxTypeEntity';
import { CreateTaxTypeDTO } from '@/domain/entities/tax_types/DTOs/CreateTaxTypeDTO';
import { TAX_TYPE_OPERATIONS } from '../../constants/taxTypeOperations';

interface TaxTypesFormProps {
	taxType?: TaxTypeEntity | null;
	onCancel: () => void;
	onSuccess?: () => void;
}

export default function TaxTypesForm({ taxType, onCancel, onSuccess }: TaxTypesFormProps) {
	const isEditMode = !!taxType;
	const { handleCreateTaxType, isLoading: isCreating } = useCreateTaxType();
	const { handleUpdateTaxType, isLoading: isUpdating } = useUpdateTaxType();

	const isLoading = isCreating || isUpdating;

	const methods = useForm<CreateTaxTypeFormType | UpdateTaxTypeFormType>({
		mode: 'onChange',
		resolver: zodResolver(isEditMode ? updateTaxTypeSchema : createTaxTypeSchema),
		defaultValues: isEditMode ? defaultUpdateTaxTypeValues(taxType) : defaultCreateTaxTypeValues
	});

	const { control, formState, handleSubmit, reset } = methods;
	const { errors, isValid } = formState;

	useEffect(() => {
		if (taxType) {
			reset(defaultUpdateTaxTypeValues(taxType));
		} else {
			reset(defaultCreateTaxTypeValues);
		}
	}, [taxType, reset]);

	const onSubmit = async (data: CreateTaxTypeFormType | UpdateTaxTypeFormType) => {
		try {
			if (isEditMode && taxType) {
				await handleUpdateTaxType({
					id: taxType.id,
					...(data as UpdateTaxTypeFormType)
				});
			} else {
				await handleCreateTaxType(data as unknown as CreateTaxTypeDTO);
			}

			onSuccess?.();
			onCancel();
		} catch (error) {
			console.error(error);
		}
	};

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
				<FormProvider {...methods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack spacing={4}>
							{/* Header */}
							<Box>
								<Typography
									variant="h5"
									fontWeight={700}
									gutterBottom
								>
									{isEditMode ? 'Actualizar tipo de impuesto' : 'Crear tipo de impuesto'}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{isEditMode
										? 'Modifique la información del tipo de impuesto'
										: 'Complete la información para crear un nuevo tipo de impuesto'}
								</Typography>
							</Box>

							<Divider />

							{/* Información detallada */}
							<Box>
								<SectionTitle
									icon={Description}
									title="Información General"
								/>

								<Stack spacing={3}>
									<Stack
										direction="row"
										spacing={2}
									>
										<Controller
											name="code"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Código"
													placeholder="Ej: IVA"
													error={!!errors.code}
													helperText={errors.code?.message}
													fullWidth
													variant="filled"
													InputProps={{
														startAdornment: (
															<Tag
																color="action"
																fontSize="small"
																sx={{ mr: 1 }}
															/>
														)
													}}
												/>
											)}
										/>

										<Controller
											name="name"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Nombre"
													placeholder="Ej: Impuesto al Valor Agregado"
													error={!!errors.name}
													helperText={errors.name?.message}
													fullWidth
													variant="filled"
												/>
											)}
										/>
									</Stack>

									<Controller
										name="description"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Descripción"
												placeholder="Descripción del impuesto..."
												multiline
												rows={3}
												error={!!errors.description}
												helperText={errors.description?.message}
												fullWidth
												variant="filled"
											/>
										)}
									/>

									<Controller
										name="operation"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												select
												label="Operación"
												error={!!errors.operation}
												helperText={errors.operation?.message}
												fullWidth
												variant="filled"
											>
												{TAX_TYPE_OPERATIONS.map((option) => (
													<MenuItem
														key={option.value}
														value={option.value}
													>
														{option.label}
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
									Cancelar
								</Button>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									startIcon={<Save />}
									disabled={!isValid || isLoading}
								>
									{isEditMode ? 'Actualizar' : 'Crear'}
								</Button>
							</Stack>
						</Stack>
					</form>
				</FormProvider>
			</Box>
		</Fade>
	);
}
