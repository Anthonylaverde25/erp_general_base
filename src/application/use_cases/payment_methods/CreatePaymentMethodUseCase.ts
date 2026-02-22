import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IPaymentMethodRepository } from '@/domain/entities/payment_methods/repositories/payment_method.interface.repository';
import { CreatePaymentMethodDTO } from '@/domain/entities/payment_methods/DTOs/CreatePaymentMethodDTO';
import { PaymentMethodEntity } from '@/domain/entities/payment_methods/PaymentMethod';

@injectable()
export class CreatePaymentMethodUseCase
	implements IUseCase<CreatePaymentMethodDTO, { paymentMethod: PaymentMethodEntity; message: string }>
{
	constructor(
		@inject(TYPES.IPaymentMethodRepository)
		private readonly repository: IPaymentMethodRepository
	) {}

	async execute(data: CreatePaymentMethodDTO): Promise<{ paymentMethod: PaymentMethodEntity; message: string }> {
		const paymentMethod = PaymentMethodEntity.create(data);
		return await this.repository.create(paymentMethod);
	}
}
