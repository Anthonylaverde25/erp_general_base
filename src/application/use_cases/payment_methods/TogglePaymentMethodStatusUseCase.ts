import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import type { IPaymentMethodActionRepository } from "@/domain/entities/payment_methods/repositories/payment_method.action.repository";
import { IUseCase } from "@/application/use_cases/IUseCase";

@injectable()
export class TogglePaymentMethodStatusUseCase implements IUseCase<{ id: number; status: boolean }, void> {
    constructor(
        @inject(TYPES.IPaymentMethodActionRepository)
        private repository: IPaymentMethodActionRepository
    ) { }

    async execute(params: { id: number; status: boolean }): Promise<void> {
        return this.repository.toggleStatus(params.id, params.status);
    }
}
