import axiosInstance from '@/lib/@axios';
import { injectable } from 'inversify';
import { IPaymentMethodActionRepository } from '@/domain/entities/payment_methods/repositories/payment_method.action.repository';

@injectable()
export class PaymentMethodRepositoryAction implements IPaymentMethodActionRepository {
	async toggleStatus(id: number, status: boolean): Promise<void> {
		await axiosInstance.put(`payment-methods/${id}/toggle-status`, { is_active: status });
	}
}
