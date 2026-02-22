import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IContactRepository } from '@/domain/entities/contacts/repositories/contact.interface.repository';
import { CreateContactDTO } from '@/domain/entities/contacts/DTOs/CreateContactDTO';
import { ContactEntity } from '@/domain/entities/contacts/Contact';

@injectable()
export class CreateContactUseCase
	implements IUseCase<{ companyId: number; data: CreateContactDTO }, { contact: ContactEntity; message: string }>
{
	constructor(
		@inject(TYPES.IContactRepository)
		private readonly repository: IContactRepository
	) {}

	async execute({
		companyId,
		data
	}: {
		companyId: number;
		data: CreateContactDTO;
	}): Promise<{ contact: ContactEntity; message: string }> {
		const contact = ContactEntity.create(data);
		return await this.repository.create(companyId, contact);
	}
}
