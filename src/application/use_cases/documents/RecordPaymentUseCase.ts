import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IDocumentActionRepository } from '@/domain/entities/documents/repositories/document.action.repository';

@injectable()
export class RecordPaymentUseCase {
    constructor(
        @inject(TYPES.IDocumentActionRepository) private repository: IDocumentActionRepository
    ) { }

    async execute(id: string, payload: { amount: number; payment_date: string; payment_method_id?: number; reference?: string; notes?: string; allocations?: { document_id: number; amount: number }[] }): Promise<any> {
        return this.repository.recordPayment(id, payload);
    }
}
