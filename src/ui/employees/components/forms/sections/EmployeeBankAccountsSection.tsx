import { Controller, useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import {
	TextField,
	Button,
	Box,
	Typography,
	Card,
	CardContent,
	Stack
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Plus, Trash } from 'lucide-react';
import { EmployeeFormType } from '@/schemas/employee/employee.schema';

interface EmployeeBankAccountsSectionProps {
	isLoading: boolean;
}

const sectionTitleStyle = {
	fontWeight: 700,
	fontSize: '1rem',
	color: 'text.primary',
	borderLeft: '4px solid #005483',
	pl: 1.5,
	mb: 2
};

export function EmployeeBankAccountsSection({ isLoading }: EmployeeBankAccountsSectionProps) {
	const {
		control,
		setValue,
		formState: { errors }
	} = useFormContext<EmployeeFormType>();

	const { fields: bankFields, append: appendBank, remove: removeBank } = useFieldArray({
		control,
		name: 'bank_accounts'
	});

	const bankAccounts = useWatch({ control, name: 'bank_accounts' });

	const textFieldProps = {
		fullWidth: true,
		variant: 'filled' as const,
		disabled: isLoading
	};

	return (
		<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '4px' }}>
			<CardContent sx={{ p: 3 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
					<Typography sx={{ ...sectionTitleStyle, mb: 0 }}>
						Cuentas Bancarias
					</Typography>
					<Button
						variant="outlined"
						color="secondary"
						size="small"
						startIcon={<Plus size={16} />}
						onClick={() => appendBank({ name: '', account_holder: '', account_number: '', swift: '', is_default: false })}
						disabled={isLoading}
						sx={{ textTransform: 'none', borderRadius: '4px' }}
					>
						Añadir Cuenta
					</Button>
				</Stack>

				<Stack spacing={3}>
					{bankFields.length === 0 && (
						<Box sx={{ border: '1px dashed', borderColor: 'divider', bgcolor: 'action.hover', p: 4, textAlign: 'center', borderRadius: '4px' }}>
							<Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
								No hay cuentas bancarias registradas.
							</Typography>
						</Box>
					)}
					{bankFields.map((fieldItem, index) => {
						const isDefault = bankAccounts?.[index]?.is_default;
						return (
							<Box
								key={fieldItem.id}
								sx={{
									border: '1px solid',
									borderColor: isDefault ? 'secondary.light' : 'divider',
									borderRadius: '4px',
									p: 3,
									bgcolor: isDefault ? 'action.selected' : 'transparent',
									transition: 'all 0.2s'
								}}
							>
								<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
									<Controller
										name={`bank_accounts.${index}.is_default`}
										control={control}
										render={({ field }) => (
											<Stack
												direction="row"
												spacing={1.5}
												alignItems="center"
												sx={{ cursor: 'pointer', userSelect: 'none' }}
												onClick={() => {
													bankFields.forEach((_, i) => setValue(`bank_accounts.${i}.is_default`, false));
													setValue(`bank_accounts.${index}.is_default`, true);
													field.onChange(true);
												}}
											>
												<Box
													sx={{
														width: 16,
														height: 16,
														borderRadius: '50%',
														border: '1px solid',
														borderColor: field.value ? 'secondary.main' : 'text.disabled',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														bgcolor: field.value ? 'secondary.main' : 'transparent'
													}}
												>
													{field.value && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'white' }} />}
												</Box>
												<Typography variant="body2" fontWeight={500} color={field.value ? 'secondary.main' : 'text.secondary'}>
													{field.value ? 'Cuenta Principal' : 'Marcar como Principal'}
												</Typography>
											</Stack>
										)}
									/>
									<Button
										size="small"
										color="error"
										onClick={() => removeBank(index)}
										sx={{ minWidth: 0, p: 1 }}
										disabled={isLoading}
									>
										<Trash size={16} />
									</Button>
								</Stack>

								<Grid container spacing={2}>
									<Grid size={{ xs: 12, sm: 6 }}>
										<Controller
											name={`bank_accounts.${index}.name`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													label="Banco / Entidad"
													error={!!errors.bank_accounts?.[index]?.name}
													helperText={errors.bank_accounts?.[index]?.name?.message}
												/>
											)}
										/>
									</Grid>
									<Grid size={{ xs: 12, sm: 6 }}>
										<Controller
											name={`bank_accounts.${index}.account_holder`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													label="Titular"
													error={!!errors.bank_accounts?.[index]?.account_holder}
													helperText={errors.bank_accounts?.[index]?.account_holder?.message}
												/>
											)}
										/>
									</Grid>
									<Grid size={{ xs: 12, sm: 8 }}>
										<Controller
											name={`bank_accounts.${index}.account_number`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													label="CBU / CVU / Nro. Cuenta"
													error={!!errors.bank_accounts?.[index]?.account_number}
													helperText={errors.bank_accounts?.[index]?.account_number?.message}
												/>
											)}
										/>
									</Grid>
									<Grid size={{ xs: 12, sm: 4 }}>
										<Controller
											name={`bank_accounts.${index}.swift`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													{...textFieldProps}
													label="SWIFT / Alias"
													error={!!errors.bank_accounts?.[index]?.swift}
													helperText={errors.bank_accounts?.[index]?.swift?.message}
												/>
											)}
										/>
									</Grid>
								</Grid>
							</Box>
						);
					})}
				</Stack>
			</CardContent>
		</Card>
	);
}
