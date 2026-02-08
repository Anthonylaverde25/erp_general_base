import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Typography,
    Divider,
    InputAdornment,
    IconButton,
    Stack,
    Fade,
    Alert,
    MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock, Shield, Save, Close } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';

import useIndexRoles from '@/features/roles/hooks/useIndexRoles';
import useUpdateUser from '@/features/users/hooks/useUpdateUser';
import {
    UpdateUserFormType,
    updateUserSchema,
} from "@/schemas/user/user.schema";
import { defaultUpdateUserValues } from "@/schemas/user/user.defaults";
import { IUpdateUser, IUser } from "@/types/user.types";

interface UpdateUserFormProps {
    user: IUser;
    onCancel: () => void;
    onSuccess?: () => void;
}

export default function UpdateUserForm({ user, onCancel, onSuccess }: UpdateUserFormProps) {
    const { handleUpdateUser, isLoading, isError } = useUpdateUser();
    const { roles } = useIndexRoles();

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const { control, formState, handleSubmit, reset } = useForm<UpdateUserFormType>({
        mode: 'onChange',
        resolver: zodResolver(updateUserSchema),
        defaultValues: defaultUpdateUserValues(user)
    });

    const { errors, isValid } = formState;

    useEffect(() => {
        if (user) {
            reset(defaultUpdateUserValues(user));
        }
    }, [user, reset]);

    console.log('user entidad desde el form', user)

    const onSubmit = async (data: UpdateUserFormType) => {
        try {
            const payload: IUpdateUser = {
                id: data.id,
                name: data.name,
                email: data.email,
                role_id: data.role_id,
                department_ids: [],
                phone: data.phone || ''
            };

            // Solo incluir password si se ha proporcionado
            if (data.password && data.password.length > 0) {
                payload.password = data.password;
                payload.password_confirmation = data.password_confirmation;
            }

            await handleUpdateUser(data.id, payload);
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
            <Box >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={4}>
                        {/* Header */}
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                gutterBottom
                            >
                                Actualizar usuario
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Modifique la información del usuario {user.name}
                            </Typography>
                        </Box>

                        <Divider />

                        {/* Información Personal */}
                        <Box>
                            <SectionTitle
                                icon={Person}
                                title="Información personal"
                            />

                            <Stack spacing={3}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Nombre completo"
                                            placeholder="Ej: Juan Pérez García"
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            fullWidth
                                            variant="filled"
                                        />
                                    )}
                                />

                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                >
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Correo electrónico"
                                                placeholder="usuario@empresa.com"
                                                type="email"
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                                fullWidth
                                                variant="filled"
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Teléfono"
                                                placeholder="+54 11 1234-5678"
                                                type="tel"
                                                error={!!errors.phone}
                                                helperText={errors.phone?.message}
                                                fullWidth
                                                variant="filled"
                                            />
                                        )}
                                    />
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Seguridad */}
                        <Box>
                            <SectionTitle
                                icon={Lock}
                                title="Cambiar contraseña (opcional)"
                            />

                            <Stack spacing={3}>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                >
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Nueva contraseña"
                                                placeholder="Dejar vacío para mantener la actual"
                                                type={showPassword ? 'text' : 'password'}
                                                error={!!errors.password}
                                                helperText={errors.password?.message}
                                                fullWidth
                                                variant="filled"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => setShowPassword((v) => !v)}
                                                                edge="end"
                                                                tabIndex={-1}
                                                            >
                                                                {showPassword ? (
                                                                    <VisibilityOff fontSize="small" />
                                                                ) : (
                                                                    <Visibility fontSize="small" />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="password_confirmation"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Confirmar nueva contraseña"
                                                placeholder="Repita la nueva contraseña"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                error={!!errors.password_confirmation}
                                                helperText={errors.password_confirmation?.message}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => setShowConfirmPassword((v) => !v)}
                                                                edge="end"
                                                                tabIndex={-1}
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <VisibilityOff fontSize="small" />
                                                                ) : (
                                                                    <Visibility fontSize="small" />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </Stack>

                                <Alert
                                    severity="info"
                                    variant="outlined"
                                    icon={<Lock fontSize="small" />}
                                    sx={{ borderRadius: 1.5 }}
                                >
                                    Deje los campos vacíos si no desea cambiar la contraseña. Si desea cambiarla, debe
                                    tener al menos 8 caracteres.
                                </Alert>
                            </Stack>
                        </Box>

                        {/* Roles */}
                        <Box>
                            <SectionTitle
                                icon={Shield}
                                title="Roles y permisos"
                            />

                            <Controller
                                name="role_id"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Seleccionar rol"
                                        error={!!errors.role_id}
                                        helperText={
                                            errors.role_id?.message || 'Asigne el rol correspondiente al usuario'
                                        }
                                        fullWidth
                                        variant="filled"
                                        value={field.value || ''}
                                    >
                                        {roles?.map((role) => (
                                            <MenuItem
                                                key={role.id}
                                                value={role.id}
                                            >
                                                <Stack>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={500}
                                                    >
                                                        {role.name}
                                                    </Typography>
                                                    {role.description && (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {role.description}
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Box>

                        {/* Actions */}
                        <Divider />

                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            spacing={2}
                            sx={{ pt: 1 }}
                        >
                            <Button
                                onClick={onCancel}
                                color="inherit"
                                variant="outlined"
                                disabled={isLoading}
                                startIcon={<Close />}
                                sx={{
                                    px: 3,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 1.5
                                }}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!isValid || isLoading}
                                startIcon={<Save />}
                                sx={{
                                    px: 4,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 1.5,
                                    boxShadow: 2,
                                    '&:hover': {
                                        boxShadow: 4
                                    }
                                }}
                            >
                                {isLoading ? 'Guardando...' : 'Actualizar usuario'}
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Box>
        </Fade>
    );
}
