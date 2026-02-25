import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Tooltip, CircularProgress, Chip } from '@mui/material';
import { InsertDriveFileOutlined, DeleteOutline, DownloadOutlined, CloudUploadOutlined } from '@mui/icons-material';
import useGetFilesByFileable from '@/features/files/hooks/useGetFilesByFileable';
import { useDeleteFile } from '@/features/files/hooks/useDeleteFile';
import { useDownloadFile } from '@/features/files/hooks/useDownloadFile';
import { useViewFile } from '@/features/files/hooks/useViewFile';
import { RemoveRedEyeOutlined } from '@mui/icons-material';
import DepartmentFileModal from './DepartmentFileModal';
import { format } from 'date-fns';

interface DepartmentFilesListProps {
    departmentId: number;
}

export default function DepartmentFilesList({ departmentId }: DepartmentFilesListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { files, isLoading } = useGetFilesByFileable('department', departmentId);
    const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile();
    const { mutate: downloadFile, isPending: isDownloading } = useDownloadFile();
    const { mutate: viewFile, isPending: isViewing } = useViewFile();

    const handleDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
            deleteFile(id);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const getDocIconColors = (mimeType: string) => {
        if (mimeType.includes('pdf')) return { bg: 'rgba(239, 68, 68, 0.1)', color: 'rgb(220, 38, 38)' };
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet'))
            return { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(22, 163, 74)' };
        if (mimeType.includes('word') || mimeType.includes('document'))
            return { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(37, 99, 235)' };
        if (mimeType.includes('image')) return { bg: 'rgba(234, 179, 8, 0.1)', color: 'rgb(202, 138, 4)' };
        return { bg: 'rgba(100, 116, 139, 0.1)', color: 'rgb(100, 116, 139)' };
    };

    return (
        <Box className="col-span-1">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.01em' }}>
                    Archivos Adjuntos
                </Typography>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CloudUploadOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    Subir Archivo
                </Button>
            </Box>
            <Box className="flex flex-col gap-3 rounded-md border p-3 bg-slate-50/30">
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : files && files.length > 0 ? (
                    files.map((file) => {
                        const iconColors = getDocIconColors(file.mime_type);
                        return (
                            <Box
                                key={file.id}
                                className="flex items-center gap-3 p-3 rounded-md bg-white border shadow-sm transition-colors hover:bg-slate-50"
                                sx={{ borderColor: 'divider' }}
                            >
                                <Box
                                    sx={{
                                        p: 1.25,
                                        borderRadius: 1.5,
                                        bgcolor: iconColors.bg,
                                        color: iconColors.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <InsertDriveFileOutlined fontSize="small" />
                                </Box>
                                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        noWrap
                                        sx={{ lineHeight: 1.2, mb: 0.5, color: 'text.primary' }}
                                        title={file.file_name}
                                    >
                                        {file.file_name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                        {file.file_type && (
                                            <Chip
                                                label={file.file_type.name}
                                                size="small"
                                                sx={{ height: 16, fontSize: '0.65rem' }}
                                            />
                                        )}
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                            {formatSize(file.size)} • {format(new Date(file.created_at), 'dd MMM yyyy')}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="Ver">
                                        <IconButton
                                            size="small"
                                            color="info"
                                            onClick={() => viewFile(file.id)}
                                            disabled={isViewing || isDownloading || isDeleting}
                                        >
                                            <RemoveRedEyeOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Descargar">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => downloadFile(file.id)}
                                            disabled={isDownloading}
                                        >
                                            <DownloadOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(file.id)}
                                            disabled={isDeleting}
                                        >
                                            <DeleteOutline fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        );
                    })
                ) : (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                        No hay archivos adjuntos en este departamento.
                    </Typography>
                )}
            </Box>

            <DepartmentFileModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                departmentId={departmentId}
            />
        </Box>
    );
}
