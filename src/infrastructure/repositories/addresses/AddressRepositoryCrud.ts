import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { IAddressRepository } from '@/domain/entities/addresses/repositories/address.interface.crud';
import { AddressEntity } from '@/domain/entities/addresses/Address';
import { CreateAddressDTO } from '@/domain/entities/addresses/DTOs/CreateAddressDTO';
import { Address } from '@/types/company.types';
import { AddressMapper } from '@/domain/entities/addresses/Mappers/AddressMapper';

@injectable()
export class AddressRepositoryCrud implements IAddressRepository {
    async create(companyId: number, data: CreateAddressDTO): Promise<{ address: AddressEntity; message: string }> {
        const {
            data: { address, message }
        } = await axiosInstance.post(`companies/${companyId}/addresses`, data);
        return {
            address: AddressMapper.fromDetailDTO(address),
            message
        };
    }

    async show(id: Address['id']): Promise<AddressEntity> {
        const {
            data: { address }
        } = await axiosInstance.get(`addresses/${id}`);
        return AddressEntity.create(address);
    }

    async update(id: Address['id'], data: Partial<AddressEntity>): Promise<{ address: AddressEntity; message: string; }> {
        const payload = data.toPlainObject();
        try {

            const { data: { address, message } } = await axiosInstance.put(`addresses/${id}`, payload);
            return {
                address: AddressMapper.fromDetailDTO(address),
                message
            };
        } catch (error) {
            throw error;
        }
    }



    async delete(id: number): Promise<void> {
        await axiosInstance.delete(`addresses/${id}`);
    }
}
