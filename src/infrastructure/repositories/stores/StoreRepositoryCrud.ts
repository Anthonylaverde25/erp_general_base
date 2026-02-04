import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { IStoreRepository } from '@/domain/entities/stores/repositories/store.interface.repository';
import { StoreEntity } from '@/domain/entities/stores/StoreEntity';
import { CreateStoreDTO } from '@/domain/entities/stores/DTOs/CreateStoreDTO';
import { StoreMapper } from '@/domain/entities/stores/Mappers/StoreMapper';

@injectable()
export class StoreRepositoryCrud implements IStoreRepository {
    async index(): Promise<StoreEntity[]> {
        const { data: { stores } } = await axiosInstance.get(`stores`);
        return StoreMapper.fromDetailDTOList(stores);
    }

    async create(data: CreateStoreDTO): Promise<{ store: StoreEntity; message: string }> {
        const {
            data: { store, message }
        } = await axiosInstance.post(`stores`, data);
        return {
            store: StoreMapper.fromDetailDTO(store),
            message
        };
    }

    async show(id: number): Promise<StoreEntity> {
        const {
            data: { store }
        } = await axiosInstance.get(`stores/${id}`);
        return StoreEntity.fromPrimitives(store);
    }

    async update(id: number, data: Partial<StoreEntity>): Promise<{ store: StoreEntity; message: string; }> {
        const { data: { store, message } } = await axiosInstance.put(`stores/${id}`, data);
        return {
            store: StoreMapper.fromDetailDTO(store),
            message
        };
    }

    async delete(id: number): Promise<void> {
        await axiosInstance.delete(`stores/${id}`);
    }
}
