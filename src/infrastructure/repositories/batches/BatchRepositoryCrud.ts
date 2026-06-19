import { injectable } from 'inversify';
import { IBatchRepository } from '@/domain/entities/batches/repositories/batch.interface.repository';
import { BatchEntity } from '@/domain/entities/batches/BatchEntity';
import { IBatch, IUpdateBatch } from '@/types/batch.types';
import axiosInstance from '@/lib/@axios';

@injectable()
export class BatchRepositoryCrud implements IBatchRepository {
	private readonly endpoint = 'batches';

	async index(filters: Record<string, any> = {}): Promise<{ data: BatchEntity[]; meta: any }> {
		const {
			data: { batches, meta }
		} = await axiosInstance.get<{ batches: IBatch[]; meta: any }>(this.endpoint, { params: filters });
		return {
			data: batches.map((b) => BatchEntity.fromPrimitives(b)),
			meta
		};
	}

	async show(id: number): Promise<BatchEntity> {
		const {
			data: { data }
		} = await axiosInstance.get<{ data: IBatch }>(`${this.endpoint}/${id}`);
		return BatchEntity.fromPrimitives(data);
	}

	async update(id: number, data: IUpdateBatch): Promise<BatchEntity> {
		const {
			data: { data: updatedBatch }
		} = await axiosInstance.put<{ data: IBatch }>(`${this.endpoint}/${id}`, data);
		return BatchEntity.fromPrimitives(updatedBatch);
	}
}
