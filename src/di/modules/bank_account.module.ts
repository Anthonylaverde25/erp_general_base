import { Container } from "inversify";
import { TYPES } from "../types";
import { BankAccountRepositoryCrud } from "@/infrastructure/repositories/bank_accounts/bank_account.repository.crud";
import { IBankAccountCrudRepository } from "@/domain/entities/bank_accounts/repositories/bank_account.interface.crud";
import { IndexBankAccountUseCase } from "@/application/use_cases/bank_accounts/IndexBankAccountUseCase";
import { CreateBankAccountUseCase } from '@/application/use_cases/companies/CreateBankAccountUseCase';
import { UpdateBankAccountUseCase } from "@/application/use_cases/bank_accounts/UpdateBankAccountUseCase";
import { ShowBankAccountUseCase } from "@/application/use_cases/bank_accounts/ShowBankAccountUseCase";

export const registerBankAccountModule = (container: Container) => {
  container
    .bind<IBankAccountCrudRepository>(TYPES.IBankAccountCrudRepository)
    .to(BankAccountRepositoryCrud)
    .inSingletonScope();
  container
    .bind<IndexBankAccountUseCase>(TYPES.IndexBankAccountUseCase)
    .to(IndexBankAccountUseCase);
  container
    .bind<ShowBankAccountUseCase>(TYPES.ShowBankAccountUseCase)
    .to(ShowBankAccountUseCase);
  container
    .bind<CreateBankAccountUseCase>(TYPES.CreateBankAccountUseCase)
    .to(CreateBankAccountUseCase);
  container
    .bind<UpdateBankAccountUseCase>(TYPES.UpdateBankAccountUseCase)
    .to(UpdateBankAccountUseCase);
};
