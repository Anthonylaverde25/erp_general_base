import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import type { IBankAccountCrudRepository } from "@/domain/entities/bank_accounts/repositories/bank_account.interface.crud";
import { BankAccountEntity } from "@/domain/entities/bank_accounts/BankAccount";

@injectable()
export class IndexBankAccountUseCase {
  constructor(
    @inject(TYPES.IBankAccountCrudRepository)
    private repository: IBankAccountCrudRepository,
  ) {}

  async execute(): Promise<BankAccountEntity[]> {
    return this.repository.index();
  }
}
