import { useEffect, useState, SyntheticEvent } from 'react';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    TextField,
    MenuItem,
    Typography,
    Box,
    Tabs,
    Tab,
    Divider,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Stack,
    Fade
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Save, Close } from '@mui/icons-material';

import { partnerSchema, PartnerFormType } from '@/schemas/partners/partners.schema';
import { defaultCreatePartnerValues, defaultUpdatePartnerValues } from '@/schemas/partners/partners.defaults';
import PartnerFormTabPanel from '@/ui/partners/components/PartnerFormTabPanel';

import { useCreatePartner } from '@/features/partners/hooks/useCreatePartner';
import { useUpdatePartner } from '@/features/partners/hooks/useUpdatePartner';
import useIndexPaymentMethods from '@/features/payment_methods/hooks/useIndexPaymentMethods';
import { CreatePartnerDTO, PartnerType } from '@/domain/entities/partners/DTOs/PartnerDTOs';
import { CreateAddressDTO } from '@/domain/entities/addresses/DTOs/CreateAddressDTO';
import { CreateContactDTO } from '@/domain/entities/contacts/DTOs/CreateContactDTO';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';

interface PartnersFormProps {
    data?: PartnerEntity | null;
    onCancel: () => void;
    onSuccess?: () => void;
}

export function PartnersForm({ data, onCancel, onSuccess }: PartnersFormProps) {
    const createPartner = useCreatePartner();
    const updatePartner = useUpdatePartner();
    const { paymentMethods } = useIndexPaymentMethods();
    const [tabValue, setTabValue] = useState(0);

    const {
        control,
        handleSubmit,
        reset,
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

    useEffect(() => {
        if (data) {
            reset(defaultUpdatePartnerValues(data));
        }
    }, [data, reset]);

    const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const onSubmit = (values: PartnerFormType) => {
        const address: CreateAddressDTO[] = [];
        if (values.address_street || values.address_city) {
            address.push({
                street: values.address_street || '',
                city: values.address_city || '',
                state: values.address_state || '',
                postal_code: values.address_postal_code || '',
                country: values.address_country || '',
                default: true
            });
        }

        const contact: CreateContactDTO[] = [];
        if (values.contact_email || values.contact_phone) {
            contact.push({
                email: values.contact_email || '',
                phone: values.contact_phone || '',
                default: true
            });
        }

        const dto: CreatePartnerDTO = {
            name: values.name,
            comercial_name: values.comercial_name || '',
            vat_number: values.vat_number || '',
            cif: values.cif || '',
            type: values.type as PartnerType,
            role: values.role,
            payment_method_id: Number(values.payment_method_id),
            website: values.website || '',
            address: address.length > 0 ? address : undefined,
            contact: contact.length > 0 ? contact : undefined,
            bank_accounts: values.bank_accounts?.map(acc => ({
                name: acc.name || '',
                account_holder: acc.account_holder || '',
                account_number: acc.account_number || '',
                swift: acc.swift || '',
                is_default: acc.is_default
            }))
        };

        if (data) {
            updatePartner.mutate({ id: data.id, data: dto as any }, {
                onSuccess: () => {
                    onSuccess?.();
                    onCancel();
                }
            });
        } else {
            createPartner.mutate(dto, {
                onSuccess: () => {
                    onSuccess?.();
                    onCancel();
                }
            });
        }
    };

    function a11yProps(index: number) {
        return {
            id: `partner-tab-${index}`,
            'aria-controls': `partner-tabpanel-${index}`,
        };
    }

    const textFieldProps = {
        fullWidth: true,
        variant: "filled" as const,
    };

    const isLoading = createPartner.isPending || updatePartner.isPending;

    return (
        <Fade in={true}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-[650px]">
                {/* Header Section */}
                <Box className="flex-none p-6 pb-2">
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                        {data ? "Editar Socio" : "Crear Socio"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data ? "Actualice los detalles del socio." : "Introduzca los detalles del nuevo socio."}
                    </Typography>
                </Box>

                {/* HEADER FIELDS */}
                <Box className="flex-none px-6 py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
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
                                    />
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
                    </div>
                </Box>

                {/* TABS HEADER */}
                <Box sx={{ px: 3, mt: 2, mb: 1 }} className="flex items-center justify-between">
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="partner settings tabs">
                        <Tab label="Principal" {...a11yProps(0)} />
                        <Tab label="Cuentas" {...a11yProps(1)} />
                        <Tab label="Preferencias" {...a11yProps(2)} />
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
                                                bgcolor: 'secondary.dark',
                                            }
                                        }
                                    }
                                }}
                            >
                                <ToggleButton value="client">Cliente</ToggleButton>
                                <ToggleButton value="supplier">Proveedor</ToggleButton>
                                <ToggleButton value="both">Cliente/Proveedor</ToggleButton>
                                <ToggleButton value="prospect">Prospecto</ToggleButton>
                            </ToggleButtonGroup>
                        )}
                    />
                </Box>

                <Divider />

                {/* TAB CONTENT */}
                <Box className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-transparent">
                    <PartnerFormTabPanel value={tabValue} index={0}>
                        <div className="space-y-6">
                            <div>
                                <Typography variant="subtitle2" className="mb-3 font-bold text-gray-700 dark:text-gray-300 uppercase">
                                    Datos de Contacto
                                </Typography>
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                    <div className="col-span-12 sm:col-span-6">
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
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
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
                                    </div>
                                    <div className="col-span-12">
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
                            </div>

                            <Divider />

                            <div>
                                <Typography variant="subtitle2" className="mb-3 font-bold text-gray-700 dark:text-gray-300 uppercase">
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
                                                    label="Dirección"
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
                                            name="address_state"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    {...textFieldProps}
                                                    label="Provincia / Estado"
                                                    error={!!errors.address_state}
                                                    helperText={errors.address_state?.message}
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
                                                    label="Código Postal"
                                                    error={!!errors.address_postal_code}
                                                    helperText={errors.address_postal_code?.message}
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
                                                    placeholder="Seleccionar País..."
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
                    </PartnerFormTabPanel>

                    <PartnerFormTabPanel value={tabValue} index={1}>
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
                    </PartnerFormTabPanel>

                    <PartnerFormTabPanel value={tabValue} index={2}>
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
                        </div>
                    </PartnerFormTabPanel>
                </Box>

                <Divider />

                {/* Actions Section */}
                <Stack direction="row" spacing={2} justifyContent="flex-end" className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-divider">
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
                        {isLoading ? 'Guardando...' : (data ? "Actualizar" : "Crear Socio")}
                    </Button>
                </Stack>
            </form>
        </Fade>
    );
}
