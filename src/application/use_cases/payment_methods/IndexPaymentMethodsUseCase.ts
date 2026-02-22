import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IPaymentMethodRepository } from '@/domain/entities/payment_methods/repositories/payment_method.interface.repository';
import { PaymentMethodEntity } from '@/domain/entities/payment_methods/PaymentMethod';

@injectable()
export class IndexPaymentMethodsUseCase implements IUseCase<void, PaymentMethodEntity[]> {
	constructor(
		@inject(TYPES.IPaymentMethodRepository)
		private readonly repository: IPaymentMethodRepository
	) {}

	async execute(): Promise<PaymentMethodEntity[]> {
		return await this.repository.index();
	}
}
