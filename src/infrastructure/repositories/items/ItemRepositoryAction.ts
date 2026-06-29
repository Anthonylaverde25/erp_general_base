import axiosInstance from '@/lib/@axios';
import { injectable } from 'inversify';
import {
	IItemActionRepository,
	RegisterStockMovementDTO,
	AdjustStockEntryDTO,
	PaginatedStockMovements
} from '@/domain/entities/items/repositories/item.action.repository';
import type { PendingSerializationItem, RegisterSerialsPayload } from '@/types/pending-serialization.types';
import type { ItemSerialDTO, PaginatedItemSerials } from '@/types/item-serials.types';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';
import { ItemMapper } from '@/infrastructure/mappers/items/ItemMapper';
import { ItemDTO } from '@/domain/entities/items/DTOs/ItemDTOs';

@injectable()
export class ItemRepositoryAction implements IItemActionRepository {
	private readonly baseUrl = '/items';

	async updateStockAlert(
		id: number,
		data: { has_stock_alert: boolean; stock_min: number | null }
	): Promise<{ item: ItemEntity; message: string }> {
		const {
			data: { item, message }
		} = await axiosInstance.patch<{ item: ItemDTO; message: string }>(`${this.baseUrl}/${id}/stock-alert`, data);
		return {
			item: ItemMapper.toDomain(item),
			message: message || 'Alarma de stock actualizada'
		};
	}

	async registerStockMovement(data: RegisterStockMovementDTO): Promise<{ message: string }> {
		const {
			data: { message }
		} = await axiosInstance.post<{ message: string }>('/stock-movements', data);
		return {
			message: message || 'Movimiento de stock registrado'
		};
	}

	async adjustStockEntry(data: AdjustStockEntryDTO): Promise<{ message: string; server_timestamp: string }> {
		const {
			data: { message, server_timestamp }
		} = await axiosInstance.post<{ message: string; server_timestamp: string }>(
			'/stock-movements/adjust-entry',
			data
		);
		return {
			message: message || 'Entrada de stock registrada',
			server_timestamp
		};
	}
	async indexStockMovements(
		itemId?: number | null,
		page = 1,
		perPage = 15,
		filters?: { partner_id?: number | null; start_date?: string | null; end_date?: string | null }
	): Promise<PaginatedStockMovements> {
		const url = itemId ? `${this.baseUrl}/${itemId}/stock-movements` : '/stock-movements';
		const { data } = await axiosInstance.get<PaginatedStockMovements>(url, {
			params: {
				page,
				per_page: perPage,
				...filters
			}
		});
		return data;
	}

	async indexPendingSerialization(): Promise<PendingSerializationItem[]> {
		const { data } = await axiosInstance.get<{ pending_items: PendingSerializationItem[] }>(
			`${this.baseUrl}/pending-serialization`
		);
		return data.pending_items;
	}

	async registerItemSerials(id: number, payload: RegisterSerialsPayload): Promise<{ message: string }> {
		const { data } = await axiosInstance.post<{ message: string }>(
			`${this.baseUrl}/${id}/register-serials`,
			payload
		);
		return data;
	}

	async indexItemSerials(
		page = 1,
		perPage = 15,
		filters?: {
			search?: string;
			status?: string;
			start_date?: string;
			end_date?: string;
			document_type?: string;
		}
	): Promise<PaginatedItemSerials> {
		const { data } = await axiosInstance.get<PaginatedItemSerials>(
			`${this.baseUrl}/serials`,
			{
				params: {
					page,
					per_page: perPage,
					...filters
				}
			}
		);
		return data;
	}
}

