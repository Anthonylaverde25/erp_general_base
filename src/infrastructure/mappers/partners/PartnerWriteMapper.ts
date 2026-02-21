import { CreatePartnerDTO, UpdatePartnerDTO } from '@/domain/entities/partners/DTOs/PartnerDTOs';
import { CreatePartnerWriteData, UpdatePartnerWriteData } from '@/domain/entities/partners/PartnerEntity';

export class PartnerWriteMapper {
	static toCreateDTO(data: CreatePartnerWriteData): CreatePartnerDTO {
		return {
			company_id: data.companyId,
			name: data.name,
			comercial_name: data.comercialName,
			vat_number: data.vatNumber,
			cif: data.cif,
			role: data.role,
			payment_method_id: data.paymentMethodId,
			type: data.type,
			credit_available: data.creditAvailable,
			grouped_billing: data.groupedBilling,
			currency_id: data.currencyId,
			website: data.website,
			address: data.address,
			contact: data.contact,
			bank_accounts: data.bankAccounts,
			sale_tax_ids: data.saleTaxIds,
			purchase_tax_ids: data.purchaseTaxIds
		};
	}

	static toUpdateDTO(data: UpdatePartnerWriteData): UpdatePartnerDTO {
		return {
			company_id: data.companyId,
			name: data.name,
			comercial_name: data.comercialName,
			vat_number: data.vatNumber,
			cif: data.cif,
			role: data.role,
			payment_method_id: data.paymentMethodId,
			type: data.type,
			credit_available: data.creditAvailable,
			grouped_billing: data.groupedBilling,
			currency_id: data.currencyId,
			website: data.website,
			address: data.address,
			contact: data.contact,
			bank_accounts: data.bankAccounts,
			sale_tax_ids: data.saleTaxIds,
			purchase_tax_ids: data.purchaseTaxIds
		};
	}
}
