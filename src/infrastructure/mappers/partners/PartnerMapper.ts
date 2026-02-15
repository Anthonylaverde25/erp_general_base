import { PartnerEntity } from "@/domain/entities/partners/PartnerEntity";
import { PartnerDTO } from "@/domain/entities/partners/DTOs/PartnerDTOs";
import { AddressEntity } from "@/domain/entities/addresses/Address";
import { ContactEntity } from "@/domain/entities/contacts/Contact";
import { BankAccountEntity } from "@/domain/entities/bank_accounts/BankAccount";

export class PartnerMapper {
    static fromDTO(dto: PartnerDTO): PartnerEntity {
        let role = dto.role || 'prospect';

        if (dto.roles && Array.isArray(dto.roles)) {
            const roles = dto.roles.map((r: any) => r.role);
            if (roles.includes('client') && roles.includes('supplier')) {
                role = 'client_supplier';
            } else if (roles.includes('client')) {
                role = 'client';
            } else if (roles.includes('supplier')) {
                role = 'supplier';
            } else if (roles.includes('prospect')) {
                role = 'prospect';
            }
        }

        return new PartnerEntity(
            dto.id,
            dto.company_id,
            dto.name,
            dto.comercial_name,
            dto.vat_number,
            dto.cif,
            role,
            dto.payment_method_id,
            dto.type,
            dto.credit_available ?? false,
            dto.grouped_billing ?? false,
            dto.currency_id ?? null,
            Array.isArray(dto.address)
                ? dto.address.map((addr) => AddressEntity.fromPrimitives(addr))
                : [],
            Array.isArray(dto.contact)
                ? dto.contact.map((cnt) => ContactEntity.fromPrimitives(cnt))
                : [],
            Array.isArray(dto.bank_accounts)
                ? dto.bank_accounts.map((acc) => BankAccountEntity.fromPrimitives(acc))
                : [],
            dto.sale_taxes || [],
            dto.purchase_taxes || []
        );
    }

    static fromDTOList(dtos: PartnerDTO[]): PartnerEntity[] {
        return dtos.map((dto) => PartnerMapper.fromDTO(dto));
    }
}
