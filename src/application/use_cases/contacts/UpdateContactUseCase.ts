import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IContactRepository } from '@/domain/entities/contacts/repositories/contact.interface.repository';
import { ContactEntity } from '@/domain/entities/contacts/Contact';

@injectable()
export class UpdateContactUseCase
	implements IUseCase<{ id: number; data: Partial<ContactEntity> }, { contact: ContactEntity; message: string }>
{
	constructor(
		@inject(TYPES.IContactRepository)
		private readonly repository: IContactRepository
	) {}

	async execute({
		id,
		data
	}: {
		id: number;
		data: Partial<ContactEntity>;
	}): Promise<{ contact: ContactEntity; message: string }> {
		const contact = ContactEntity.update(id, data);
		return await this.repository.update(id, contact);
	}
}
