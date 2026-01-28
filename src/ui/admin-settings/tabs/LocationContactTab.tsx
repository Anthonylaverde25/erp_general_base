import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import {
    Box,
    TextField,
    Stack,
    Typography,
    FormControlLabel,
    Switch,
    Button,
    Divider,
    IconButton
} from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
    accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ArrowForwardIosSharp, Add, LocationOn, ContactPhone, Email, Phone } from '@mui/icons-material';
import { CompanySettingsForm } from '../pages/SettingPage';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

// Styled Accordion Components
const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharp sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
        transform: 'rotate(90deg)',
    },
    [`& .${accordionSummaryClasses.content}`]: {
        marginLeft: theme.spacing(1),
    },
    ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(255, 255, 255, .05)',
    }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(3),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function LocationContactTab() {
    const { control, formState: { errors } } = useFormContext<CompanySettingsForm>();

    const { fields: addressFields, append: appendAddress } = useFieldArray({
        control,
        name: 'addresses'
    });

    const { fields: contactFields, append: appendContact } = useFieldArray({
        control,
        name: 'contacts'
    });

    const [expandedAddress, setExpandedAddress] = React.useState<number | false>(0);
    const [expandedContact, setExpandedContact] = React.useState<number | false>(0);

    const handleAddressChange = (panel: number) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpandedAddress(newExpanded ? panel : false);
    };

    const handleContactChange = (panel: number) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpandedContact(newExpanded ? panel : false);
    };

    return (
        <Box>
            {/* Addresses Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h6" fontWeight={600}>
                        Direcciones
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Ubicaciones y residencia fiscal
                    </Typography>
                </Box>
                <Button
                    className="btn-primary"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<Add />}
                    onClick={() => {
                        appendAddress({ street: '', city: '', state: '', postal_code: '', country: '', default: false });
                        setExpandedAddress(addressFields.length);
                    }}
                >
                    Agregar Dirección
                </Button>
            </Stack>

            {addressFields.length > 0 ? (
                <Box mb={4}>
                    {addressFields.map((field, index) => (
                        <Accordion
                            key={field.id}
                            expanded={expandedAddress === index}
                            onChange={handleAddressChange(index)}
                        >
                            <AccordionSummary>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%', pr: 2 }}>
                                    <LocationOn color="primary" fontSize="small" />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography fontWeight={500}>
                                            {field.street || `Dirección ${index + 1}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {[field.city, field.state, field.country]
                                                .filter(Boolean)
                                                .join(', ') || 'Sin detalles'}
                                        </Typography>
                                    </Box>
                                    {field.default && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                fontWeight: 600
                                            }}
                                        >
                                            PRINCIPAL
                                        </Typography>
                                    )}
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // TODO: Open edit modal for address
                                            console.log('Edit address', index);
                                        }}
                                        sx={{ ml: 1 }}
                                    >
                                        <FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>
                                    </IconButton>
                                </Stack>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Stack spacing={3}>
                                    <Controller
                                        name={`addresses.${index}.street`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Calle y número"
                                                placeholder="Ej: Av. Libertador 1234"
                                                error={!!errors.addresses?.[index]?.street}
                                                helperText={errors.addresses?.[index]?.street?.message}
                                                fullWidth
                                                variant="filled"
                                                InputProps={{ readOnly: true }}
                                            />
                                        )}
                                    />

                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                        <Controller
                                            name={`addresses.${index}.city`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Ciudad"
                                                    placeholder="Ciudad"
                                                    error={!!errors.addresses?.[index]?.city}
                                                    helperText={errors.addresses?.[index]?.city?.message}
                                                    fullWidth
                                                    variant="filled"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name={`addresses.${index}.state`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Provincia / Estado"
                                                    placeholder="Provincia"
                                                    error={!!errors.addresses?.[index]?.state}
                                                    helperText={errors.addresses?.[index]?.state?.message}
                                                    fullWidth
                                                    variant="filled"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            )}
                                        />
                                    </Stack>

                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                        <Controller
                                            name={`addresses.${index}.postal_code`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Código Postal"
                                                    placeholder="CP"
                                                    error={!!errors.addresses?.[index]?.postal_code}
                                                    helperText={errors.addresses?.[index]?.postal_code?.message}
                                                    fullWidth
                                                    variant="filled"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name={`addresses.${index}.country`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="País"
                                                    placeholder="País"
                                                    error={!!errors.addresses?.[index]?.country}
                                                    helperText={errors.addresses?.[index]?.country?.message}
                                                    fullWidth
                                                    variant="filled"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            )}
                                        />
                                    </Stack>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Dirección {addressFields[index].default ? 'principal' : 'secundaria'}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            ) : (
                <Box
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        mb: 4
                    }}
                >
                    <LocationOn sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography color="text.secondary" variant="body2">
                        No hay direcciones registradas
                    </Typography>
                </Box>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Contacts Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h6" fontWeight={600}>
                        Contactos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Canales de comunicación
                    </Typography>
                </Box>
                <Button
                    className="btn-primary"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<Add />}
                    onClick={() => {
                        appendContact({ email: '', phone: '' });
                        setExpandedContact(contactFields.length);
                    }}
                >
                    Agregar Contacto
                </Button>
            </Stack>

            {contactFields.length > 0 ? (
                <Box>
                    {contactFields.map((field, index) => (
                        <Accordion
                            key={field.id}
                            expanded={expandedContact === index}
                            onChange={handleContactChange(index)}
                        >
                            <AccordionSummary>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%', pr: 2 }}>
                                    <ContactPhone color="primary" fontSize="small" />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography fontWeight={500}>
                                            {field.email || field.phone || `Contacto ${index + 1}`}
                                        </Typography>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            {field.email && (
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {field.email}
                                                    </Typography>
                                                </Stack>
                                            )}
                                            {field.phone && (
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {field.phone}
                                                    </Typography>
                                                </Stack>
                                            )}
                                            {!field.email && !field.phone && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Sin detalles
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // TODO: Open edit modal for contact
                                            console.log('Edit contact', index);
                                        }}
                                        sx={{ ml: 1 }}
                                    >
                                        <FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>
                                    </IconButton>
                                </Stack>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                        <Controller
                                            name={`contacts.${index}.email`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Correo Electrónico"
                                                    placeholder="contacto@empresa.com"
                                                    type="email"
                                                    error={!!errors.contacts?.[index]?.email}
                                                    helperText={errors.contacts?.[index]?.email?.message}
                                                    fullWidth
                                                    variant="filled"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name={`contacts.${index}.phone`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Teléfono"
                                                    placeholder="+54 11 1234-5678"
                                                    type="tel"
                                                    error={!!errors.contacts?.[index]?.phone}
                                                    helperText={errors.contacts?.[index]?.phone?.message}
                                                    fullWidth
                                                    variant="filled"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            ) : (
                <Box
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }}
                >
                    <ContactPhone sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography color="text.secondary" variant="body2">
                        No hay contactos registrados
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
