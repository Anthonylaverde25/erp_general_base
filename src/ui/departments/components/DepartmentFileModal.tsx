import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Button, Box, Typography, TextField, MenuItem, Stack } from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';
import { useUploadFile } from '@/features/files/hooks/useUploadFile';
import useIndexFileTypes from '@/features/file_types/hooks/useIndexFileTypes';

interface DepartmentFileModalProps {
    open: boolean;
    onClose: () => void;
    departmentId: number;
}

export default function DepartmentFileModal({ open, onClose, departmentId }: DepartmentFileModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [fileTypeId, setFileTypeId] = useState<string>('');
    const { fileTypes, isLoading: isLoadingTypes } = useIndexFileTypes();
    const { mutate: uploadFile, isPending } = useUploadFile();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        uploadFile(
            {
                fileableType: 'department',
                fileableId: departmentId,
                file,
                fileTypeId: fileTypeId ? parseInt(fileTypeId, 10) : undefined
            },
            {
                onSuccess: () => {
                    setFile(null);
                    setFileTypeId('');
                    onClose();
                }
            }
        );
    };

    return (
        <Dialog open={open} onClose={isPending ? undefined : onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
                Subir Archivo
                {!isPending && (
                    <IconButton
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent dividers>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Seleccionar archivo
                            </Typography>
                            <Button variant="outlined" component="label" fullWidth startIcon={<CloudUpload />} sx={{ height: 100, borderStyle: 'dashed' }}>
                                {file ? file.name : 'Haz clic para explorar'}
                                <input type="file" hidden onChange={handleFileChange} />
                            </Button>
                        </Box>

                        <TextField
                            select
                            label="Tipo de Archivo (Opcional)"
                            value={fileTypeId}
                            onChange={(e) => setFileTypeId(e.target.value)}
                            fullWidth
                            size="small"
                            disabled={isLoadingTypes}
                        >
                            <MenuItem value="">
                                <em>Ninguno</em>
                            </MenuItem>
                            {fileTypes?.filter(ft => ft.is_active).map((ft) => (
                                <MenuItem key={ft.id} value={ft.id}>
                                    {ft.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Box display="flex" justifyContent="flex-end" gap={1}>
                            <Button onClick={onClose} disabled={isPending}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={!file || isPending}>
                                {isPending ? 'Subiendo...' : 'Subir'}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </DialogContent>
        </Dialog>
    );
}
