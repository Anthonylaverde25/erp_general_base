import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IContactRepository } from '@/domain/entities/contacts/repositories/contact.interface.repository';

@injectable()
export class DeleteContactUseCase implements IUseCase<number, void> {
    constructor(
        @inject(TYPES.IContactRepository)
        private readonly repository: IContactRepository
    ) { }

    async execute(id: number): Promise<void> {
        return await this.repository.delete(id);
    }
}
