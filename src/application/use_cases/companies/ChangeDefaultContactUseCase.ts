import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { ICompanyActionRepository } from '@/domain/entities/companies/repositories/company.interface.action';

@injectable()
export class ChangeDefaultContactUseCase {
	constructor(@inject(TYPES.ICompanyActionRepository) private repository: ICompanyActionRepository) {}

	execute(contactId: number) {
		return this.repository.changeDefaultContact(contactId);
	}
}
