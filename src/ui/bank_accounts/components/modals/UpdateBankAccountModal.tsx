import { Dialog, DialogContent, Box, CircularProgress } from "@mui/material";
import UpdateBankAccountForm from "../forms/UpdateBankAccountForm";
import useShowBankAccount from "@/features/bank_accounts/hooks/useShowBankAccount";

interface UpdateBankAccountModalProps {
  open: boolean;
  onClose: () => void;
  bankAccountId: number;
}

export default function UpdateBankAccountModal({
  open,
  onClose,
  bankAccountId,
}: UpdateBankAccountModalProps) {
  const { bankAccount, isLoading: isFetching } =
    useShowBankAccount(bankAccountId);

  if (isFetching) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (!bankAccount) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <UpdateBankAccountForm
          bankAccount={bankAccount}
          onCancel={onClose}
          onSuccess={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
