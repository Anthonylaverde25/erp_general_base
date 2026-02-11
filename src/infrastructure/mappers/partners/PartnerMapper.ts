import { PartnerEntity } from "@/domain/entities/partners/PartnerEntity";
import { PartnerDTO } from "@/domain/entities/partners/DTOs/PartnerDTOs";
import { AddressEntity } from "@/domain/entities/addresses/Address";
import { ContactEntity } from "@/domain/entities/contacts/Contact";
import { BankAccountEntity } from "@/domain/entities/bank_accounts/BankAccount";

export class PartnerMapper {
    static fromDTO(dto: PartnerDTO): PartnerEntity {
        return new PartnerEntity(
            dto.id,
            dto.company_id,
            dto.name,
            dto.comercial_name,
            dto.vat_number,
            dto.cif,
            dto.payment_method_id,
            dto.type,
            Array.isArray(dto.address)
                ? dto.address.map((addr) => AddressEntity.fromPrimitives(addr))
                : [],
            Array.isArray(dto.contact)
                ? dto.contact.map((cnt) => ContactEntity.fromPrimitives(cnt))
                : [],
            Array.isArray(dto.bank_accounts)
                ? dto.bank_accounts.map((acc) => BankAccountEntity.fromPrimitives(acc))
                : []
        );
    }

    static fromDTOList(dtos: PartnerDTO[]): PartnerEntity[] {
        return dtos.map((dto) => PartnerMapper.fromDTO(dto));
    }
}
