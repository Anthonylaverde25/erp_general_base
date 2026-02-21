import { Typography, Button, Box, TextField } from '@mui/material';
import { Controller, useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { PartnerFormType } from '@/schemas/partners/partners.schema';

interface PartnerBankAccountsSectionProps {
    isLoading: boolean;
}

const textFieldProps = {
    fullWidth: true,
    variant: "filled" as const,
};

export function PartnerBankAccountsSection({ isLoading }: PartnerBankAccountsSectionProps) {
    const { control, setValue, formState: { errors } } = useFormContext<PartnerFormType>();

    const { fields: bankAccountsFields, append: appendBankAccount, remove: removeBankAccount } = useFieldArray({
        control,
        name: "bank_accounts"
    });

    const bankAccounts = useWatch({ control, name: 'bank_accounts' });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="subtitle2" className="font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Cuentas Bancarias
                </Typography>
                {bankAccountsFields.length > 0 && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        startIcon={<FuseSvgIcon size={18}>heroicons-outline:plus</FuseSvgIcon>}
                        onClick={() => appendBankAccount({ name: '', account_holder: '', account_number: '', swift: '' })}
                        disabled={isLoading}
                    >
                        Añadir Cuenta
                    </Button>
                )}
            </div>

            {bankAccountsFields.length === 0 && (
                <Box
                    className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => appendBankAccount({ name: '', account_holder: '', account_number: '', swift: '', is_default: true })}
                >
                    <FuseSvgIcon size={48} className="mb-2 opacity-50">heroicons-outline:credit-card</FuseSvgIcon>
                    <Typography>No hay cuentas bancarias asociadas</Typography>
                    <Typography variant="caption" className="mt-1">Haga clic para añadir una cuenta</Typography>
                </Box>
            )}

            {bankAccountsFields.map((item, index) => {
                const isDefault = bankAccounts?.[index]?.is_default;
                return (
                    <div
                        key={item.id}
                        className={`p-4 border rounded-lg relative transition-all duration-200 ${isDefault
                            ? 'bg-blue-50/50 border-secondary ring-1 ring-secondary dark:bg-blue-900/10'
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Controller
                                name={`bank_accounts.${index}.is_default`}
                                control={control}
                                render={({ field }) => (
                                    <div
                                        className="flex items-center cursor-pointer select-none"
                                        onClick={() => {
                                            bankAccountsFields.forEach((_, i) => setValue(`bank_accounts.${i}.is_default`, false));
                                            setValue(`bank_accounts.${index}.is_default`, true);
                                            field.onChange(true);
                                        }}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 transition-colors ${field.value ? 'border-secondary bg-secondary' : 'border-gray-400 bg-white dark:bg-gray-700'}`}>
                                            {field.value && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                        </div>
                                        <span className={`text-sm font-medium ${field.value ? 'text-secondary font-bold' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {field.value ? 'Cuenta Principal' : 'Establecer como Principal'}
                                        </span>
                                    </div>
                                )}
                            />
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => removeBankAccount(index)}
                                className="min-w-0 p-1.5"
                                disabled={isLoading}
                                sx={{
                                    borderColor: 'divider',
                                    color: 'text.secondary',
                                    '&:hover': { bgcolor: 'action.hover', color: 'text.primary' }
                                }}
                            >
                                <FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                            <div className="col-span-12 sm:col-span-6">
                                <Controller
                                    name={`bank_accounts.${index}.name`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} {...textFieldProps} label="Banco / Entidad" error={!!errors.bank_accounts?.[index]?.name} helperText={errors.bank_accounts?.[index]?.name?.message} disabled={isLoading} />
                                    )}
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <Controller
                                    name={`bank_accounts.${index}.account_holder`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} {...textFieldProps} label="Titular de la Cuenta" error={!!errors.bank_accounts?.[index]?.account_holder} helperText={errors.bank_accounts?.[index]?.account_holder?.message} disabled={isLoading} />
                                    )}
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-8">
                                <Controller
                                    name={`bank_accounts.${index}.account_number`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} {...textFieldProps} label="IBAN / Número de Cuenta" error={!!errors.bank_accounts?.[index]?.account_number} helperText={errors.bank_accounts?.[index]?.account_number?.message} disabled={isLoading} />
                                    )}
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-4">
                                <Controller
                                    name={`bank_accounts.${index}.swift`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} {...textFieldProps} label="SWIFT / BIC" error={!!errors.bank_accounts?.[index]?.swift} helperText={errors.bank_accounts?.[index]?.swift?.message} disabled={isLoading} />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
