import { BatchEntity } from '../BatchEntity';
import { IUpdateBatch } from '@/types/batch.types';

export interface IBatchRepository {
	index(filters?: Record<string, any>): Promise<{ data: BatchEntity[]; meta: any }>;
	show(id: number): Promise<BatchEntity>;
	update(id: number, data: IUpdateBatch): Promise<BatchEntity>;
}
