import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { ICashRegisterRepository } from '@/domain/repositories/ICashRegisterRepository';
import {
	ICashRegister,
	ICashRegisterCurrentSession,
	ICloseSessionPayload,
	IOpenSessionPayload,
	IRecordMovementPayload,
	ICreateCashRegisterPayload
} from '@/types/cash-register.types';

@injectable()
export class CashRegisterRepositoryImpl implements ICashRegisterRepository {
	async index(): Promise<ICashRegister[]> {
		const { data } = await axiosInstance.get('cash-registers');
		return data?.cash_registers ?? data?.data ?? [];
	}

	async currentSession(): Promise<ICashRegisterCurrentSession> {
		const { data } = await axiosInstance.get('cash-registers/sessions/current');

		if (!data?.active) {
			return {
				active: false,
				cash_register_name: null,
				session: null,
				summary: {
					opening_balance: 0,
					total_inflows: 0,
					total_outflows: 0,
					calculated_balance: 0
				},
				movements: []
			};
		}

		return {
			active: true,
			cash_register_name: data?.data?.cash_register_name ?? null,
			session: data?.data?.session ?? null,
			summary: data?.data?.summary ?? {
				opening_balance: 0,
				total_inflows: 0,
				total_outflows: 0,
				calculated_balance: 0
			},
			movements: data?.data?.movements ?? []
		};
	}

	async openSession(payload: IOpenSessionPayload): Promise<{ message?: string }> {
		const { data } = await axiosInstance.post('cash-registers/sessions/open', payload);
		return { message: data?.message };
	}

	async closeSession(payload: ICloseSessionPayload): Promise<{ message?: string }> {
		const { data } = await axiosInstance.post('cash-registers/sessions/close', payload);
		return { message: data?.message };
	}

	async recordMovement(payload: IRecordMovementPayload): Promise<{ message?: string }> {
		const { data } = await axiosInstance.post('cash-registers/movements', payload);
		return { message: data?.message };
	}

	async toggleMovementChecked(movementId: number): Promise<{ message?: string }> {
		const { data } = await axiosInstance.patch(`cash-registers/movements/${movementId}/toggle-checked`);
		return { message: data?.message };
	}

	async create(payload: ICreateCashRegisterPayload): Promise<{ message?: string; data?: ICashRegister }> {
		const { data } = await axiosInstance.post('cash-registers', payload);
		return { message: data?.message, data: data?.data };
	}
}
