import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IPaymentMethodRepository } from '@/domain/entities/payment_methods/repositories/payment_method.interface.repository';

@injectable()
export class DeletePaymentMethodUseCase implements IUseCase<number, void> {
    constructor(
        @inject(TYPES.IPaymentMethodRepository)
        private readonly repository: IPaymentMethodRepository
    ) { }

    async execute(id: number): Promise<void> {
        return await this.repository.delete(id);
    }
}
