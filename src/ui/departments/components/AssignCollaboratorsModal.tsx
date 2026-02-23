import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Checkbox, TextField,
    FormControl, InputLabel, Select, MenuItem,
    ListItemText, CircularProgress
} from '@mui/material';
import useIndexUser from '@/features/users/hooks/useIndexUsers';

interface User {
    id: number;
    name?: string;
    email?: string;
}

interface AssignCollaboratorsModalProps {
    open: boolean;
    onClose: () => void;
    departmentId: number | null;
}

export default function AssignCollaboratorsModal({
    open,
    onClose,
    departmentId
}: AssignCollaboratorsModalProps) {

    const { users, isLoading } = useIndexUser();
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

    useEffect(() => {
        if (!open) {
            setSelectedUserIds([]);
        }
    }, [open]);

    const handleSave = async () => {
        console.log(
            "Asignando usuarios al departamento",
            departmentId,
            selectedUserIds
        );

        onClose();
    };

    if (!departmentId) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Asignar Integrantes</DialogTitle>

            <DialogContent dividers className="min-h-[250px]">
                <div className="pt-2">
                    <p className="text-sm text-gray-500 mb-4">
                        Selecciona los usuarios que deseas asignar a este departamento.
                    </p>

                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <FormControl fullWidth>
                            <InputLabel id="user-select-label">
                                Usuarios
                            </InputLabel>

                            <Select
                                labelId="user-select-label"
                                multiple
                                label="Usuarios"
                                variant="filled"
                                value={selectedUserIds}
                                onChange={(event) =>
                                    setSelectedUserIds(event.target.value as number[])
                                }
                                renderValue={(selected) =>
                                    (selected as number[])
                                        .map(id => {
                                            const user = users?.find(u => u.id === id);
                                            return user?.name || user?.email;
                                        })
                                        .join(', ')
                                }
                            >
                                {users?.map((user: User) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        <Checkbox
                                            checked={selectedUserIds.includes(user.id)}
                                        />
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
                    disabled={selectedUserIds.length === 0}
                >
                    Asignar
                </Button>
            </DialogActions>
        </Dialog>
    );
}