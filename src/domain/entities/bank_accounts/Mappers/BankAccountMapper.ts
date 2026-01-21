import { BankAccountListDTO } from "../DTOs/bankAccountListDTO";
import { BankAccountEntity } from "../BankAccount";

export class BankAccountMapper {
  static fromDetailDTO(dto: BankAccountListDTO): BankAccountEntity {
    return new BankAccountEntity(
      dto.id,
      dto.name,
      dto.account_holder,
      dto.account_number,
      dto.swift,
      dto.created_at,
      dto.updated_at,
    );
  }

  static fromDetailDTOList(dtos: BankAccountListDTO[]): BankAccountEntity[] {
    return dtos.map((dto) => this.fromDetailDTO(dto));
  }
}
