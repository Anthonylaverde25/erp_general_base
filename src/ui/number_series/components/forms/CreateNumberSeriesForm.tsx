import React from 'react';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { TextField, Button, Box, Typography, Divider, Stack, Fade, MenuItem } from '@mui/material';
import { Save, Close, Description, CalendarMonth, Tag, ListAlt } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import useCreateNumberSeries from '@/features/number_series/hooks/useCreateNumberSeries';
import { createNumberSeriesSchema, CreateNumberSeriesFormType } from '@/schemas/number_series/number_series.schema';
import { defaultCreateNumberSeriesValues } from '@/schemas/number_series/number_series.defaults';
import { DocumentTypeEntity } from '@/domain/entities/document_types/DocumentTypeEntity';

interface CreateNumberSeriesFormProps {
	onCancel: () => void;
	onSuccess?: () => void;
	documentTypes?: DocumentTypeEntity[];
	isLoadingDocumentTypes?: boolean;
}

export default function CreateNumberSeriesForm({
	onCancel,
	onSuccess,
	documentTypes,
	isLoadingDocumentTypes
}: CreateNumberSeriesFormProps) {
	const { handleCreateNumberSeries, isLoading } = useCreateNumberSeries();

	const methods = useForm<CreateNumberSeriesFormType>({
		mode: 'onChange',
		resolver: zodResolver(createNumberSeriesSchema),
		defaultValues: defaultCreateNumberSeriesValues
	});

	const { control, formState, handleSubmit } = methods;
	const { errors, isValid } = formState;

	const onSubmit = async (data: CreateNumberSeriesFormType) => {
		try {
			await handleCreateNumberSeries(data);
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
									Crear nueva serie
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Complete la información para registrar una nueva serie numérica
								</Typography>
							</Box>

							<Divider />

							{/* Información de la serie */}
							<Box>
								<SectionTitle
									icon={Description}
									title="Información General"
								/>

								<Stack spacing={3}>
									<Controller
										name="document_type_id"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												select
												label="Tipo de Documento"
												error={!!errors.document_type_id}
												helperText={errors.document_type_id?.message}
												fullWidth
												variant="filled"
												onChange={(e) => field.onChange(Number(e.target.value))}
											>
												<MenuItem
													value={0}
													disabled
												>
													Seleccione un tipo
												</MenuItem>
												{documentTypes?.map((dt) => (
													<MenuItem
														key={dt.id}
														value={dt.id}
													>
														{dt.name} ({dt.code})
													</MenuItem>
												))}
											</TextField>
										)}
									/>

									<Stack
										direction="row"
										spacing={2}
									>
										<Controller
											name="serie"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Serie"
													placeholder="Ej: A, INV"
													error={!!errors.serie}
													helperText={errors.serie?.message}
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
											name="year"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Año"
													type="number"
													error={!!errors.year}
													helperText={errors.year?.message}
													fullWidth
													variant="filled"
													onChange={(e) => field.onChange(Number(e.target.value))}
													InputProps={{
														startAdornment: (
															<CalendarMonth
																color="action"
																fontSize="small"
																sx={{ mr: 1 }}
															/>
														)
													}}
												/>
											)}
										/>
									</Stack>

									<Controller
										name="terms"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Términos y Condiciones"
												placeholder="Términos específicos para esta serie..."
												multiline
												rows={3}
												error={!!errors.terms}
												helperText={errors.terms?.message}
												fullWidth
												variant="filled"
												InputProps={{
													startAdornment: (
														<ListAlt
															color="action"
															fontSize="small"
															sx={{ mr: 1, mt: 1, alignSelf: 'flex-start' }}
														/>
													)
												}}
											/>
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
									Crear serie
								</Button>
							</Stack>
						</Stack>
					</form>
				</FormProvider>
			</Box>
		</Fade>
	);
}
