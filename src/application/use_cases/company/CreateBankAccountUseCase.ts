import { CreateBankAccountType } from "@/types/bank_account.types";
import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import type { ICompanyActionRepository } from "@/domain/entities/companies/repositories/company.interface.action";
import { BankAccountEntity } from "@/domain/entities/bank_accounts/BankAccount";
import { IUseCase } from "../IUseCase";

@injectable()
export class CreateBankAccountUseCase implements IUseCase<CreateBankAccountType, { bank_account: BankAccountEntity; message: string }> {
  constructor(
    @inject(TYPES.ICompanyActionRepository)
    private repository: ICompanyActionRepository,
  ) { }

  async execute(
    data: CreateBankAccountType,
  ): Promise<{ bank_account: BankAccountEntity; message: string }> {
    const bankAccount = BankAccountEntity.create(data);
    return this.repository.createBankAccount(bankAccount);
  }
}
