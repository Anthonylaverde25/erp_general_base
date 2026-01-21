import { CreateBankAccountType } from "@/types/bank_account.types";
import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import type { IBankAccountCrudRepository } from "@/domain/entities/bank_accounts/repositories/bank_account.interface.crud";
import { BankAccountEntity } from "@/domain/entities/bank_accounts/BankAccount";

@injectable()
export class CreateBankAccountUseCase {
  constructor(
    @inject(TYPES.IBankAccountCrudRepository)
    private repository: IBankAccountCrudRepository,
  ) {}

  async execute(
    data: CreateBankAccountType,
  ): Promise<{ bank_account: BankAccountEntity; message: string }> {
    const bankAccount = BankAccountEntity.create(data);
    return this.repository.create(bankAccount);
  }
}
