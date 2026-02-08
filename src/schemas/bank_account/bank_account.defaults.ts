import { CreateBankAccountFormType, UpdateBankAccountFormType } from "./bank_account.schema";
import { IBankAccount } from "@/types/bank_account.types";

export const defaultCreateBankAccountValues: CreateBankAccountFormType = {
    name: "",
    account_holder: "",
    account_number: "",
    swift: "",
};

export const defaultUpdateBankAccountValues = (bankAccount?: IBankAccount): UpdateBankAccountFormType => ({
    id: bankAccount?.id || 0,
    name: bankAccount?.name || "",
    account_holder: bankAccount?.account_holder || "",
    account_number: bankAccount?.account_number || "",
    swift: bankAccount?.swift || "",
});
