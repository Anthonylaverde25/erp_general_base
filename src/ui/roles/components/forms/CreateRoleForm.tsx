import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Stack,
  Fade,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { Shield, Save, Close, Code, Description } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";

import useCreateRole from "@/features/roles/hooks/useCreateRole";
import {
  CreateRoleFormType,
  createRoleSchema,
} from "@/schemas/role/role.schema";
import { defaultCreateRoleValues } from "@/schemas/role/role.defaults";
import { ICreateRole } from "@/types/role.types";

interface CreateRoleFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function CreateRoleForm({
  onCancel,
  onSuccess,
}: CreateRoleFormProps) {
  const { handleCreateRole, isLoading } = useCreateRole();

  const { control, formState, handleSubmit } = useForm<CreateRoleFormType>({
    mode: "onChange",
    resolver: zodResolver(createRoleSchema),
    defaultValues: defaultCreateRoleValues,
  });

  const { errors, isValid } = formState;

  const onSubmit = async (data: ICreateRole) => {
    console.log("Submitting data:", data);
    try {
      await handleCreateRole(data);
      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error(error);
    }
  };

  const SectionTitle = ({
    icon: Icon,
    title,
  }: {
    icon: React.ElementType;
    title: string;
  }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
      <Icon fontSize="small" color="primary" />
      <Typography variant="subtitle1" fontWeight={600} color="text.primary">
        {title}
      </Typography>
    </Stack>
  );

  return (
    <Fade in timeout={400}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            {/* Header */}
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Crear nuevo rol
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete la información para registrar un nuevo rol en el
                sistema
              </Typography>
            </Box>

            <Divider />

            {/* Información del rol */}
            <Box>
              <SectionTitle icon={Shield} title="Información del rol" />

              <Stack spacing={3}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre del rol"
                      placeholder="Ej: Administrador, Editor, Usuario"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      fullWidth
                      variant="filled"
                    />
                  )}
                />

                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Código"
                      placeholder="Ej: ADMIN, EDITOR, USER"
                      error={!!errors.code}
                      helperText={
                        errors.code?.message ||
                        "Código único para identificar el rol"
                      }
                      fullWidth
                      variant="filled"
                      inputProps={{
                        style: { textTransform: "uppercase" },
                      }}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
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
                      placeholder="Describe las responsabilidades y permisos del rol"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      fullWidth
                      multiline
                      rows={3}
                      variant="filled"
                    />
                  )}
                />

                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            Rol activo
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Los roles inactivos no pueden ser asignados a
                            usuarios
                          </Typography>
                        </Box>
                      }
                    />
                  )}
                />
              </Stack>
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
                className="btn-secondary"
                onClick={onCancel}
                disabled={isLoading}
                startIcon={<Close />}
                sx={{
                  px: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 1.5,
                }}
              >
                Cancelar
              </Button>

              <Button
                className="btn-primary"
                type="submit"
                variant="contained"
                disabled={!isValid || isLoading}
                startIcon={<Save />}
                sx={{
                  px: 4,
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 1.5,
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                {isLoading ? "Guardando..." : "Crear rol"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Fade>
  );
}
