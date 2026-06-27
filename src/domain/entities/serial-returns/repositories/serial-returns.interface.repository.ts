import { ItemSerialReturnEntity } from '../ItemSerialReturnEntity';
import { ItemReturnReasonEntity } from '../ItemReturnReasonEntity';
import { IProcessSerialReturnPayload } from '@/types/serial-returns.types';

export interface ISerialReturnRepository {
	index(filters?: Record<string, any>): Promise<ItemSerialReturnEntity[]>;
	listReasons(): Promise<ItemReturnReasonEntity[]>;
	process(id: number, payload: IProcessSerialReturnPayload): Promise<ItemSerialReturnEntity>;
}
