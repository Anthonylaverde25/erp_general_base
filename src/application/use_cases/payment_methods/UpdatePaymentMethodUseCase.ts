import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IPaymentMethodRepository } from '@/domain/entities/payment_methods/repositories/payment_method.interface.repository';
import { PaymentMethodEntity } from '@/domain/entities/payment_methods/PaymentMethod';

@injectable()
export class UpdatePaymentMethodUseCase implements IUseCase<{ id: number, data: Partial<PaymentMethodEntity> }, { paymentMethod: PaymentMethodEntity, message: string }> {
    constructor(
        @inject(TYPES.IPaymentMethodRepository)
        private readonly repository: IPaymentMethodRepository
    ) { }

    async execute({ id, data }: { id: number, data: Partial<PaymentMethodEntity> }): Promise<{ paymentMethod: PaymentMethodEntity, message: string }> {
        return await this.repository.update(id, data);
    }
}
