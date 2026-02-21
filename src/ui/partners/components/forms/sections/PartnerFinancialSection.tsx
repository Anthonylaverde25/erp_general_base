import { Typography, TextField, MenuItem, Divider, Box, Chip, Checkbox } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { PartnerFormType } from '@/schemas/partners/partners.schema';

interface PartnerFinancialSectionProps {
    isLoading: boolean;
    paymentMethods: any[];
    currencies: any[];
    taxRates: any[];
}

const textFieldProps = {
    fullWidth: true,
    variant: "filled" as const,
};

export function PartnerFinancialSection({
    isLoading,
    paymentMethods,
    currencies,
    taxRates,
}: PartnerFinancialSectionProps) {
    const { control, formState: { errors } } = useFormContext<PartnerFormType>();

    const watchedRole = useWatch({ control, name: 'role' });

    const showSaleTaxes = watchedRole === 'client' || watchedRole === 'client_supplier';
    const showPurchaseTaxes = watchedRole === 'supplier' || watchedRole === 'client_supplier';

    return (
        <div className="space-y-6">
            <div>
                <Typography variant="subtitle2" className="mb-3 font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Método de Pago
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
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
                                        <MenuItem key={pm.id} value={String(pm.id)}>
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
                                        <MenuItem key={currency.id} value={String(currency.id)}>
                                            {currency.name} ({currency.symbol})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </div>
                </div>
            </div>

            {(showSaleTaxes || showPurchaseTaxes) && (
                <>
                    <Divider />
                    <Typography variant="subtitle2" className="mb-3 font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Impuestos
                    </Typography>
                    <div className={`grid gap-4 ${showSaleTaxes && showPurchaseTaxes ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                        {showSaleTaxes && (
                            <div>
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
                                                field.onChange(typeof val === 'string' ? val.split(',').map(Number) : val);
                                            }}
                                            SelectProps={{
                                                multiple: true,
                                                renderValue: (selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {(selected as number[]).map((id) => {
                                                            const tax = (taxRates || []).find((t) => t.id === id);
                                                            return tax ? (
                                                                <Chip key={id} label={`${tax.name} (${tax.percentage}%)`} size="small" />
                                                            ) : null;
                                                        })}
                                                    </Box>
                                                )
                                            }}
                                        >
                                            {(taxRates || []).map((tax) => (
                                                <MenuItem key={tax.id} value={tax.id}>
                                                    <Checkbox checked={(field.value || []).includes(tax.id)} size="small" />
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
                                                field.onChange(typeof val === 'string' ? val.split(',').map(Number) : val);
                                            }}
                                            SelectProps={{
                                                multiple: true,
                                                renderValue: (selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {(selected as number[]).map((id) => {
                                                            const tax = (taxRates || []).find((t) => t.id === id);
                                                            return tax ? (
                                                                <Chip key={id} label={`${tax.name} (${tax.percentage}%)`} size="small" />
                                                            ) : null;
                                                        })}
                                                    </Box>
                                                )
                                            }}
                                        >
                                            {(taxRates || []).map((tax) => (
                                                <MenuItem key={tax.id} value={tax.id}>
                                                    <Checkbox checked={(field.value || []).includes(tax.id)} size="small" />
                                                    {tax.name} ({tax.percentage}%)
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
