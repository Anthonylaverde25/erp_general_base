import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Autocomplete,
  TextField,
  CircularProgress
} from '@mui/material';
import { Save, Close, People } from '@mui/icons-material';
import { IUser } from '@/types/user.types';
import { useIndexEmployees } from '@/features/employees/hooks/useIndexEmployees';
import useAssociateEmployees from '@/features/users/hooks/useAssociateEmployees';

interface AssociateEmployeesModalProps {
  open: boolean;
  onClose: () => void;
  user: IUser;
}

export default function AssociateEmployeesModal({ open, onClose, user }: AssociateEmployeesModalProps) {
  const { data: employees, isLoading: loadingEmployees } = useIndexEmployees();
  const { handleAssociateEmployees, isLoading: isSaving } = useAssociateEmployees();
  
  // Inicia siempre vacío, y eliminamos el useEffect que lo sobreescribía.
  const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.id) return;
    const employeeIds = selectedEmployees.map((emp) => emp.id);
    try {
      await handleAssociateEmployees(user.id, employeeIds);
      // Limpiamos el estado local después de guardar exitosamente
      setSelectedEmployees([]); 
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      {/* Es importante mantener un overflow "visible" si el contenido es pequeño, 
          aunque al ser un Portal, el Autocomplete ya no debería afectar el scroll */}
      <DialogContent sx={{ overflow: 'visible' }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <Stack spacing={1}>
            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
              >
                Asociar Empleados
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <People
                  fontSize="small"
                  color="primary"
                />
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="text.primary"
                >
                  Selección de Empleados
                </Typography>
              </Stack>

              {loadingEmployees ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  py={3}
                >
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Autocomplete
                  multiple
                  options={employees || []}
                  getOptionLabel={(option) =>
                    option.full_name || `${option.first_name} ${option.last_name}`
                  }
                  value={selectedEmployees}
                  onChange={(event, newValue) => {
                    setSelectedEmployees(newValue);
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  /* Al NO usar disablePortal, la lista se renderiza al final del DOM. 
                    Con style le forzamos un z-index altísimo para que pase por encima del Dialog.
                  */
                  slotProps={{
                    popper: {
                      style: { zIndex: 9999 } 
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="Empleados autorizados"
                      placeholder="Buscar empleados..."
                      fullWidth
                    />
                  )}
                />
              )}
            </Box>

            <Divider />

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Button
                onClick={() => {
                  setSelectedEmployees([]); // Limpiamos si el usuario cancela
                  onClose();
                }}
                color="inherit"
                variant="outlined"
                disabled={isSaving}
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
                disabled={isSaving}
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
                {isSaving ? 'Guardando...' : 'Guardar Relación'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}