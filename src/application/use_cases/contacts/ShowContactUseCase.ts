import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IContactRepository } from '@/domain/entities/contacts/repositories/contact.interface.repository';
import { ContactEntity } from '@/domain/entities/contacts/Contact';

@injectable()
export class ShowContactUseCase implements IUseCase<number, ContactEntity> {
    constructor(
        @inject(TYPES.IContactRepository)
        private readonly repository: IContactRepository
    ) { }

    async execute(id: number): Promise<ContactEntity> {
        return await this.repository.show(id);
    }
}
