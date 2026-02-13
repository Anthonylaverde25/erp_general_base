import { useEffect, useState, SyntheticEvent, useRef } from 'react';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import FusePageSimple from "@fuse/core/FusePageSimple";
import {
    TextField,
    MenuItem,
    Typography,
    Box,
    Divider,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Stack,
    Checkbox,
    Chip,
    Paper,
    useTheme
} from '@mui/material';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Save, ArrowBack } from '@mui/icons-material';

import { partnerSchema, PartnerFormType } from '@/schemas/partners/partners.schema';
import { defaultCreatePartnerValues } from '@/schemas/partners/partners.defaults';

import { useCreatePartner } from '@/features/partners/hooks/useCreatePartner';
import useIndexPaymentMethods from '@/features/payment_methods/hooks/useIndexPaymentMethods';
import { CreatePartnerDTO } from '@/domain/entities/partners/DTOs/PartnerDTOs';
import useActiveCompany from "@/features/companies/useActiveCompany";
import { useIndexTaxRates } from '@/features/tax_rates/hooks/useIndexTaxRates';

import { mapPartnerFormToDTO } from '@/ui/partners/components/forms/PartnerForm.utils';
import PageBreadcrumb from "@/components/PageBreadcrumb";

function CreatePartnerPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const { handleCreatePartner, isLoading: isCreating } = useCreatePartner();
    const { paymentMethods } = useIndexPaymentMethods();
    const activeCompany = useActiveCompany();
    const { data: taxRates } = useIndexTaxRates();

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

    const { fields: bankAccountsFields, append: appendBankAccount, remove: removeBankAccount } = useFieldArray({
        control,
        name: "bank_accounts"
    });

    const bankAccounts = useWatch({ control, name: 'bank_accounts' });
    const watchedRole = useWatch({ control, name: 'role' });

    const showSaleTaxes = watchedRole === 'client' || watchedRole === 'client_supplier';
    const showPurchaseTaxes = watchedRole === 'supplier' || watchedRole === 'client_supplier';

    const onCancel = () => {
        navigate(-1);
    };

    const onSubmit = async (values: PartnerFormType) => {
        if (!activeCompany?.id) {
            console.error("No active company found");
            return;
        }
        const dto = mapPartnerFormToDTO(values, activeCompany.id);

        try {
            await handleCreatePartner(dto as CreatePartnerDTO);
            navigate(-1);
        } catch (error) {
            console.error(error);
        }
    };

    const textFieldProps = {
        fullWidth: true,
        variant: "filled" as const,
    };

    const isLoading = isCreating;

    return (
        <FusePageSimple
            header={
                <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-2 sm:space-y-0 p-6 sm:px-12 border-b bg-background-paper">
                    <div className="flex flex-col items-start">
                        <PageBreadcrumb className="mb-4" />
                        <div className="flex items-center gap-2">
                            <Button
                                className="min-w-0 w-8 h-8 p-0 rounded-full"
                                onClick={onCancel}
                            >
                                <FuseSvgIcon>heroicons-outline:arrow-left</FuseSvgIcon>
                            </Button>
                            <Typography variant="h2" className="text-3xl font-bold tracking-tight">
                                Nuevo Socio
                            </Typography>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            variant="contained"
                            color="secondary"
                            disabled={!isValid || isLoading}
                            startIcon={isLoading ? undefined : <Save />}
                        >
                            {isLoading ? 'Guardando...' : "Guardar Socio"}
                        </Button>
                    </div>
                </div>
            }
            content={
                <div className="w-full max-w-7xl mx-auto p-6 sm:p-12">
                    <form className="space-y-8">
                        {/* SECTION 1: GENERAL INFO */}
                        <div>
                            <Typography variant="h6" className="mb-4 font-semibold text-xl">
                                Información General
                            </Typography>
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
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
                                <div className="col-span-12">
                                    <Typography variant="subtitle2" className="mb-2 text-text-secondary">Rol del Socio</Typography>
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
                                                fullWidth
                                                className="sm:w-auto"
                                            >
                                                <ToggleButton value="client" className="px-6">Cliente</ToggleButton>
                                                <ToggleButton value="supplier" className="px-6">Proveedor</ToggleButton>
                                                <ToggleButton value="client_supplier" className="px-6">Cliente / Proveedor</ToggleButton>
                                                <ToggleButton value="prospect" className="px-6">Prospecto</ToggleButton>
                                            </ToggleButtonGroup>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <Divider light />

                        {/* SECTION 2: CONTACT & ADDRESS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Column 1: Contact */}
                            <div className="space-y-6">
                                <Typography variant="h6" className="font-semibold text-xl">
                                    Datos de Contacto
                                </Typography>
                                <div className="space-y-4">
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
                            <div className="space-y-6">
                                <Typography variant="h6" className="font-semibold text-xl">
                                    Dirección Fiscal
                                </Typography>
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
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

                        <Divider light />

                        {/* SECTION 3: BANK ACCOUNTS */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <Typography variant="h6" className="font-semibold text-xl">
                                    Cuentas Bancarias
                                </Typography>
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
                            </div>

                            <div className="space-y-4">
                                {bankAccountsFields.map((item, index) => {
                                    const isDefault = bankAccounts?.[index]?.is_default;
                                    return (
                                        <div
                                            key={item.id}
                                            className={`py-6 border-b border-divider relative transition-all duration-200 ${isDefault
                                                ? ''
                                                : ''
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <Controller
                                                    name={`bank_accounts.${index}.is_default`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div
                                                            className="flex items-center cursor-pointer select-none group"
                                                            onClick={() => {
                                                                bankAccountsFields.forEach((_, i) => setValue(`bank_accounts.${i}.is_default`, false));
                                                                setValue(`bank_accounts.${index}.is_default`, true);
                                                                field.onChange(true);
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 transition-colors ${field.value ? 'border-secondary bg-secondary' : 'border-gray-400 bg-white dark:bg-gray-700 group-hover:border-secondary'}`}>
                                                                {field.value && <div className="w-2 h-2 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={`text-sm font-medium ${field.value ? 'text-secondary font-bold' : 'text-text-primary group-hover:text-secondary'}`}>
                                                                {field.value ? 'Cuenta Principal' : 'Establecer como Principal'}
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
                        </div>

                        <Divider light />

                        {/* SECTION 4: FINANCIAL & TAXES */}
                        <div>
                            <Typography variant="h6" className="mb-6 font-semibold text-xl">
                                Datos Financieros
                            </Typography>
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mb-8">
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
                            </div>

                            {(showSaleTaxes || showPurchaseTaxes) && (
                                <>
                                    <Typography variant="subtitle1" fontWeight={600} className="mb-4 text-text-secondary">
                                        Configuración de Impuestos
                                    </Typography>
                                    <div className={`grid gap-8 ${showSaleTaxes && showPurchaseTaxes ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                                        {showSaleTaxes && (
                                            <div className="mt-4">
                                                <Typography variant="subtitle2" fontWeight={600} className="mb-3 flex items-center gap-2">
                                                    <FuseSvgIcon size={18} className="text-secondary">heroicons-outline:tag</FuseSvgIcon>
                                                    Impuestos de Venta
                                                </Typography>
                                                <Controller
                                                    name="sale_tax_ids"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...textFieldProps}
                                                            select
                                                            label="Seleccionar impuestos"
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
                                                                                <Chip key={id} label={`${tax.name} (${tax.percentage}%)`} size="small" color="primary" variant="outlined" />
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
                                            <div className="mt-4">
                                                <Typography variant="subtitle2" fontWeight={600} className="mb-3 flex items-center gap-2">
                                                    <FuseSvgIcon size={18} className="text-secondary">heroicons-outline:shopping-cart</FuseSvgIcon>
                                                    Impuestos de Compra
                                                </Typography>
                                                <Controller
                                                    name="purchase_tax_ids"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...textFieldProps}
                                                            select
                                                            label="Seleccionar impuestos"
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
                                                                                <Chip key={id} label={`${tax.name} (${tax.percentage}%)`} size="small" color="secondary" variant="outlined" />
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
                    </form>
                </div>
            }
            scroll="content"
        />
    );
}

export default CreatePartnerPage;
