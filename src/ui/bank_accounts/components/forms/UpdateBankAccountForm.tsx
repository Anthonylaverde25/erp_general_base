import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Stack,
  Fade,
} from "@mui/material";
import { Business, Save, Close } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";

import useUpdateBankAccount from "@/features/bank_accounts/hooks/useUpdateBankAccount";
import useShowBankAccount from "@/features/bank_accounts/hooks/useShowBankAccount";
import {
  UpdateBankAccountFormType,
  updateBankAccountSchema,
} from "@/schemas/bank_account/bank_account.schema";
import { defaultUpdateBankAccountValues } from "@/schemas/bank_account/bank_account.defaults";
import { IUpdateBankAccount } from "@/types/bank_account.types";
import { IBankAccount } from "@/types/bank_account.types";

interface UpdateBankAccountFormProps {
  bankAccount: IBankAccount;
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function UpdateBankAccountForm({
  bankAccount,
  onCancel,
  onSuccess,
}: UpdateBankAccountFormProps) {
  const { handleUpdateBankAccount, isLoading } = useUpdateBankAccount();

  const { control, formState, handleSubmit, reset } =
    useForm<UpdateBankAccountFormType>({
      mode: "onChange",
      resolver: zodResolver(updateBankAccountSchema),
      defaultValues: defaultUpdateBankAccountValues(bankAccount),
    });

  const { errors, isValid } = formState;

  useEffect(() => {
    if (bankAccount) {
      reset(defaultUpdateBankAccountValues(bankAccount));
    }
  }, [bankAccount, reset]);

  const onSubmit = async (data: UpdateBankAccountFormType) => {
    try {
      const payload: IUpdateBankAccount = {
        id: data.id,
        name: data.name,
        account_holder: data.account_holder,
        account_number: data.account_number,
        swift: data.swift,
      };

      await handleUpdateBankAccount(data.id, payload);
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
                Actualizar cuenta bancaria
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Modifique la información de la cuenta {bankAccount.name}
              </Typography>
            </Box>

            <Divider />

            {/* Información de la cuenta */}
            <Box>
              <SectionTitle
                icon={Business}
                title="Información de la cuenta bancaria"
              />

              <Stack spacing={3}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre de la cuenta"
                      placeholder="Ej: Cuenta Principal, Cuenta de Gastos"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      fullWidth
                      variant="filled"
                    />
                  )}
                />

                <Controller
                  name="account_holder"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Titular de la cuenta"
                      placeholder="Nombre de la empresa o persona"
                      error={!!errors.account_holder}
                      helperText={errors.account_holder?.message}
                      fullWidth
                      variant="filled"
                    />
                  )}
                />

                <Controller
                  name="account_number"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Número de cuenta"
                      placeholder="Ej: ES9121000418450200051332"
                      error={!!errors.account_number}
                      helperText={errors.account_number?.message}
                      fullWidth
                      variant="filled"
                    />
                  )}
                />

                <Controller
                  name="swift"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Código SWIFT/BIC"
                      placeholder="Ej: BBVAMM"
                      error={!!errors.swift}
                      helperText={
                        errors.swift?.message ||
                        "Código internacional de 8 a 11 caracteres"
                      }
                      fullWidth
                      variant="filled"
                      inputProps={{
                        style: { textTransform: "uppercase" },
                        maxLength: 11,
                      }}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  )}
                />
              </Stack>
            </Box>

            <Divider />

            {/* Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
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
                Actualizar
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Fade>
  );
}
