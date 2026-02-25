import React, { useEffect } from 'react';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { TextField, Button, Box, Typography, Divider, Stack, Fade } from '@mui/material';
import { Save, Close, Description, Tag } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateFileType } from '@/features/file_types/hooks/useCreateFileType';
import { useUpdateFileType } from '@/features/file_types/hooks/useUpdateFileType';
import {
    createFileTypeSchema,
    updateFileTypeSchema,
    CreateFileTypeFormType,
    UpdateFileTypeFormType
} from '@/schemas/file_types/file_types.schema';
import { defaultCreateFileTypeValues, defaultUpdateFileTypeValues } from '@/schemas/file_types/file_types.defaults';
import { FileTypeEntity } from '@/domain/entities/file_types/FileTypeEntity';

interface FileTypesFormProps {
    fileType?: FileTypeEntity | null;
    onCancel: () => void;
    onSuccess?: () => void;
}

export default function FileTypesForm({ fileType, onCancel, onSuccess }: FileTypesFormProps) {
    const isEditMode = !!fileType;
    const { mutateAsync: handleCreateFileType, isPending: isCreating } = useCreateFileType();
    const { mutateAsync: handleUpdateFileType, isPending: isUpdating } = useUpdateFileType();

    const isLoading = isCreating || isUpdating;

    const methods = useForm<CreateFileTypeFormType | UpdateFileTypeFormType>({
        mode: 'onChange',
        resolver: zodResolver(isEditMode ? updateFileTypeSchema : createFileTypeSchema),
        defaultValues: isEditMode ? defaultUpdateFileTypeValues(fileType) : defaultCreateFileTypeValues
    });

    const { control, formState, handleSubmit, reset } = methods;
    const { errors, isValid } = formState;

    useEffect(() => {
        if (fileType) {
            reset(defaultUpdateFileTypeValues(fileType));
        } else {
            reset(defaultCreateFileTypeValues);
        }
    }, [fileType, reset]);

    const onSubmit = async (data: CreateFileTypeFormType | UpdateFileTypeFormType) => {
        try {
            if (isEditMode && fileType) {
                await handleUpdateFileType({
                    id: fileType.id,
                    data: data as UpdateFileTypeFormType
                });
            } else {
                await handleCreateFileType(data as CreateFileTypeFormType);
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
                                    {isEditMode ? 'Actualizar tipo de archivo' : 'Crear tipo de archivo'}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {isEditMode
                                        ? 'Modifique la información del tipo de archivo'
                                        : 'Complete la información para crear un nuevo tipo de archivo'}
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
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Nombre"
                                                placeholder="Ej: Reporte Financiero"
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                                fullWidth
                                                variant="filled"
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Descripción"
                                                placeholder="Descripción del tipo de archivo..."
                                                multiline
                                                rows={3}
                                                error={!!errors.description}
                                                helperText={errors.description?.message}
                                                fullWidth
                                                variant="filled"
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
