import { injectable } from "inversify";
import { IBankAccountCrudRepository } from "@/domain/entities/bank_accounts/repositories/bank_account.interface.crud";
import { BankAccountEntity } from "@/domain/entities/bank_accounts/BankAccount";
import { BankAccountMapper } from "@/domain/entities/bank_accounts/Mappers/BankAccountMapper";
import axiosInstance from "@/lib/@axios";
import { BankAccountType } from "@/types/bank_account.types";

@injectable()
export class BankAccountRepositoryCrud implements IBankAccountCrudRepository {
  async index(): Promise<BankAccountEntity[]> {
    const {
      data: { bank_accounts },
    } = await axiosInstance.get("/bank-accounts");
    return BankAccountMapper.fromDetailDTOList(bank_accounts);
  }

  async show(id: BankAccountType["id"]): Promise<BankAccountEntity> {
    try {
      const {
        data: { bank_account },
      } = await axiosInstance.get(`/bank-accounts/${id}`);
      return BankAccountMapper.fromDetailDTO(bank_account);
    } catch (error) {
      throw error;
    }
  }

  async create(
    data: BankAccountEntity,
  ): Promise<{ bank_account: BankAccountEntity; message: string }> {
    const payload = data.toPlainObject();
    const {
      data: { bank_account, message },
    } = await axiosInstance.post("/bank-accounts", payload);

    return {
      bank_account: BankAccountMapper.fromDetailDTO(bank_account),
      message: message || "Cuenta bancaria creada correctamente",
    };
  }

  async update(
    id: number,
    data: BankAccountEntity,
  ): Promise<{ bank_account: BankAccountEntity; message: string }> {
    const payload = data.toPlainObject();
    const {
      data: { bank_account, message },
    } = await axiosInstance.put(`/bank-accounts/${id}`, payload);

    return {
      bank_account: BankAccountMapper.fromDetailDTO(bank_account),
      message: message || "Cuenta bancaria actualizada correctamente",
    };
  }
}
