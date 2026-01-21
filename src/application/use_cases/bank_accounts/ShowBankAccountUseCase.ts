import { TYPES } from "@/di/types";
import type { IBankAccountCrudRepository } from "@/domain/entities/bank_accounts/repositories/bank_account.interface.crud";
import { BankAccountEntity } from "@/domain/entities/bank_accounts/BankAccount";
import { BankAccountType } from "@/types/bank_account.types";
import { inject, injectable } from "inversify";

@injectable()
export class ShowBankAccountUseCase {
  constructor(
    @inject(TYPES.IBankAccountCrudRepository)
    private repository: IBankAccountCrudRepository,
  ) {}

  async execute(id: BankAccountType["id"]): Promise<BankAccountEntity> {
    return this.repository.show(id);
  }
}
