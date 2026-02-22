import { PaymentMethod } from '@/types/payment_method.types';
import { PaymentMethodEntity } from '../PaymentMethod';
import { CreatePaymentMethodDTO } from '../DTOs/CreatePaymentMethodDTO';

export interface IPaymentMethodRepository {
	index(): Promise<PaymentMethodEntity[]>;
	create(data: CreatePaymentMethodDTO): Promise<{ paymentMethod: PaymentMethodEntity; message: string }>;
	show(id: PaymentMethod['id']): Promise<PaymentMethodEntity>;
	update(
		id: PaymentMethod['id'],
		data: Partial<PaymentMethodEntity>
	): Promise<{ paymentMethod: PaymentMethodEntity; message: string }>;
	delete(id: number): Promise<void>;
}
