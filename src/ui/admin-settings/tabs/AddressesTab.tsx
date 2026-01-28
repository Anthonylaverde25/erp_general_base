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
    IconButton
} from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
    accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ArrowForwardIosSharp, Add, Delete, LocationOn } from '@mui/icons-material';
import { CompanySettingsForm } from '../pages/SettingPage';

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

export default function AddressesTab({ isEditing }: { isEditing: boolean }) {
    const { control, formState: { errors } } = useFormContext<CompanySettingsForm>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'addresses'
    });

    const [expanded, setExpanded] = React.useState<number | false>(0);

    const handleChange = (panel: number) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Box>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h6" fontWeight={600}>
                        Direcciones de la Empresa
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Residencia fiscal y ubicaciones principales
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        append({ street: '', city: '', state: '', postal_code: '', country: '', default: false });
                        setExpanded(fields.length);
                    }}
                    size="small"
                    disabled={!isEditing}
                >
                    Agregar Dirección
                </Button>
            </Stack>

            {/* Accordion List */}
            {fields.length > 0 ? (
                <Box>
                    {fields.map((field, index) => (
                        <Accordion
                            key={field.id}
                            expanded={expanded === index}
                            onChange={handleChange(index)}
                        >
                            <AccordionSummary
                                aria-controls={`address-${index}-content`}
                                id={`address-${index}-header`}
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{ width: '100%', pr: 2 }}
                                >
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
                                                disabled={!isEditing}
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
                                                    disabled={!isEditing}
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
                                                    disabled={!isEditing}
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
                                                    disabled={!isEditing}
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
                                                    disabled={!isEditing}
                                                />
                                            )}
                                        />
                                    </Stack>

                                    <Controller
                                        name={`addresses.${index}.default`}
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        color="primary"
                                                        disabled={!isEditing}
                                                    />
                                                }
                                                label="Marcar como dirección principal"
                                            />
                                        )}
                                    />
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            ) : (
                <Box
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }}
                >
                    <LocationOn sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary" gutterBottom>
                        No hay direcciones registradas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Agrega una dirección para tu empresa
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
