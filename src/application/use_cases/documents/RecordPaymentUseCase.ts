import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { DocumentRepositoryInterface } from '@/domain/interfaces/documents/DocumentRepositoryInterface';

@injectable()
export class RecordPaymentUseCase {
    constructor(
        @inject(TYPES.IDocumentRepository) private repository: DocumentRepositoryInterface
    ) { }

    async execute(id: string, payload: { amount: number; payment_date: string; payment_method_id?: number; reference?: string; notes?: string }): Promise<any> {
        return this.repository.recordPayment(id, payload);
    }
}
