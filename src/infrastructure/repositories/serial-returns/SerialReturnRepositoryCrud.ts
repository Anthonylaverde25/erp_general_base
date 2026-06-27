import { injectable } from 'inversify';
import { ISerialReturnRepository } from '@/domain/entities/serial-returns/repositories/serial-returns.interface.repository';
import { ItemSerialReturnEntity } from '@/domain/entities/serial-returns/ItemSerialReturnEntity';
import { ItemReturnReasonEntity } from '@/domain/entities/serial-returns/ItemReturnReasonEntity';
import { ISerialReturn, IItemReturnReason, IProcessSerialReturnPayload } from '@/types/serial-returns.types';
import axiosInstance from '@/lib/@axios';

@injectable()
export class SerialReturnRepositoryCrud implements ISerialReturnRepository {
	async index(filters: Record<string, any> = {}): Promise<ItemSerialReturnEntity[]> {
		const {
			data: { returns }
		} = await axiosInstance.get<{ returns: ISerialReturn[] }>('serial-returns', { params: filters });
		return returns.map((r) => ItemSerialReturnEntity.fromPrimitives(r));
	}

	async listReasons(): Promise<ItemReturnReasonEntity[]> {
		const {
			data: { reasons }
		} = await axiosInstance.get<{ reasons: IItemReturnReason[] }>('item-return-reasons');
		return reasons.map((r) => ItemReturnReasonEntity.fromPrimitives(r));
	}

	async process(id: number, payload: IProcessSerialReturnPayload): Promise<ItemSerialReturnEntity> {
		const {
			data: { return: updatedReturn }
		} = await axiosInstance.post<{ return: ISerialReturn }>(`serial-returns/${id}/process`, payload);
		return ItemSerialReturnEntity.fromPrimitives(updatedReturn);
	}
}
