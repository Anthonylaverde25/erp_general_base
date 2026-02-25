import { Typography, Box, Stack, Button, useTheme } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import useIndexFileTypes from '@/features/file_types/hooks/useIndexFileTypes';
import { useUpdateFileType } from '@/features/file_types/hooks/useUpdateFileType';
import { useDeleteFileType } from '@/features/file_types/hooks/useDeleteFileType';
import { FileTypeEntity } from '@/domain/entities/file_types/FileTypeEntity';
import FileTypesModal from './modals/FileTypesModal';
import FileTypesTable from './FileTypesTable';

export default function FileTypesTabView() {
    const theme = useTheme();
    const { fileTypes, isLoading, isError } = useIndexFileTypes();
    const { mutate: updateFileType } = useUpdateFileType();
    const { mutate: deleteFileType } = useDeleteFileType();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFileType, setSelectedFileType] = useState<FileTypeEntity | null>(null);

    const handleCreate = () => {
        setSelectedFileType(null);
        setModalOpen(true);
    };

    const handleEdit = (fileType: FileTypeEntity) => {
        setSelectedFileType(fileType);
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este tipo de archivo?')) {
            deleteFileType(id);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedFileType(null);
    };

    const handleStatusChange = (fileType: FileTypeEntity) => {
        updateFileType({
            id: fileType.id,
            data: { is_active: !fileType.is_active }
        });
    };

    if (isLoading)
        return (
            <Box className="flex h-64 items-center justify-center">
                <Typography color="text.secondary">Cargando tipos de archivos...</Typography>
            </Box>
        );

    if (isError)
        return (
            <Box className="flex h-64 items-center justify-center">
                <Typography color="error">Error al cargar los tipos de archivos</Typography>
            </Box>
        );

    return (
        <Box className="w-full overflow-hidden">
            {/* Header Section */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{
                    p: 3,
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography variant="h6" fontWeight="bold">Tipos de Archivos</Typography>
                <Button
                    className="btn-primary"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
                    onClick={handleCreate}
                >
                    Crear tipo de archivo
                </Button>
            </Stack>

            {/* Table Section */}
            <FileTypesTable
                fileTypes={fileTypes}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
            />

            <FileTypesModal
                open={modalOpen}
                onClose={handleCloseModal}
                fileType={selectedFileType}
            />
        </Box>
    );
}
