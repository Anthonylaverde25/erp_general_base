import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField,
    FormControl, InputLabel, Select, MenuItem,
    ListItemText, CircularProgress
} from '@mui/material';
import useIndexUser from '@/features/users/hooks/useIndexUsers';
import useUpdateDepartment from '@/features/departments/hooks/useUpdateDepartment';
import useShowDepartment from '@/features/departments/hooks/useShowDepartment';

interface User {
    id: number;
    name?: string;
    email?: string;
}

interface AssignManagerModalProps {
    open: boolean;
    onClose: () => void;
    departmentId: number | null;
}

export default function AssignManagerModal({
    open,
    onClose,
    departmentId
}: AssignManagerModalProps) {

    const { users, isLoading: isLoadingUsers } = useIndexUser();
    const { department, isLoading: isLoadingDepartment } = useShowDepartment(open ? departmentId : null);
    const { updateDepartment, isLoading: isUpdating } = useUpdateDepartment();

    const [selectedManagerId, setSelectedManagerId] = useState<number | ''>('');

    useEffect(() => {
        if (!open) {
            setSelectedManagerId('');
        } else if (department && department.manager_id) {
            setSelectedManagerId(department.manager_id);
        }
    }, [open, department]);

    const handleSave = async () => {
        if (!departmentId) return;

        try {
            await updateDepartment({
                id: departmentId,
                data: { manager_id: selectedManagerId === '' ? null : selectedManagerId }
            });
            onClose();
        } catch (error) {
            // Error is handled in the hook via notistack
            console.error('Failed to assign manager', error);
        }
    };

    if (!departmentId) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Asignar Administrador</DialogTitle>

            <DialogContent dividers className="min-h-[250px]">
                <div className="pt-2">
                    <p className="text-sm text-gray-500 mb-4">
                        Selecciona el usuario que deseas asignar como administrador de este departamento.
                    </p>

                    {isLoadingUsers || isLoadingDepartment ? (
                        <CircularProgress />
                    ) : (
                        <FormControl fullWidth>
                            <InputLabel id="manager-select-label">
                                Administrador
                            </InputLabel>

                            <Select
                                labelId="manager-select-label"
                                label="Administrador"
                                variant="filled"
                                value={selectedManagerId}
                                onChange={(event) =>
                                    setSelectedManagerId(event.target.value as number)
                                }
                            >
                                <MenuItem value="">
                                    <em>Sin administrador</em>
                                </MenuItem>
                                {users?.map((user: User) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        <ListItemText
                                            primary={user.name || `Usuario ${user.id}`}
                                            secondary={user.email}
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancelar
                </Button>

                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={isUpdating}
                >
                    {isUpdating ? <CircularProgress size={24} color="inherit" /> : 'Asignar Administrador'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
