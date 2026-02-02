import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { ICompanyActionRepository } from '@/domain/entities/companies/repositories/company.interface.action';
import { Company } from '@/types/company.types';
import { AddressEntity } from '@/domain/entities/addresses/Address';
import { AddressMapper } from '@/domain/entities/addresses/Mappers/AddressMapper';

@injectable()
export class CompanyRepositoryAction implements ICompanyActionRepository {
    async changeCompany(id: Company['id']): Promise<string> {
        const { data: { message } } = await axiosInstance.post('companies/change-active-company', { companyId: id });
        return message;
    }

    async createAddress(companyId: number, data: AddressEntity): Promise<{ address: AddressEntity, message: string }> {
        const { data: { address, message } } = await axiosInstance.post(`companies/${companyId}/addresses`, data.toPlainObject());

        return { address: AddressMapper.fromDetailDTO(address), message };
    }

    async changeDefaultAddress(addressId: number): Promise<{ status: number; message: string }> {
        const { data: { message }, status } = await axiosInstance.patch('companies/change-default-address', { address_id: addressId });
        return { status, message };
    }

    async changeDefaultContact(contactId: number): Promise<{ status: number; message: string }> {
        const { data: { message }, status } = await axiosInstance.patch('companies/change-default-contact', { contact_id: contactId });
        return { status, message };
    }
}
