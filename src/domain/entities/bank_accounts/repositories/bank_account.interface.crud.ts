import { IBankAccount } from "@/types/bank_account.types";
import { BankAccountEntity } from "../BankAccount";

export interface IBankAccountCrudRepository {
  index(): Promise<BankAccountEntity[]>;
  show(id: IBankAccount["id"]): Promise<BankAccountEntity>;
  update(
    id: number,
    data: BankAccountEntity,
  ): Promise<{ bank_account: BankAccountEntity; message: string }>;
}
