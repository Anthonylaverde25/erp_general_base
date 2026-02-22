import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { IContactRepository } from '@/domain/entities/contacts/repositories/contact.interface.repository';
import { ContactEntity } from '@/domain/entities/contacts/Contact';
import { CreateContactDTO } from '@/domain/entities/contacts/DTOs/CreateContactDTO';
import { IContact } from '@/types/company.types';
import { ContactMapper } from '@/domain/entities/contacts/Mappers/ContactMapper';

@injectable()
export class ContactRepositoryCrud implements IContactRepository {
	async create(companyId: number, data: CreateContactDTO): Promise<{ contact: ContactEntity; message: string }> {
		const {
			data: { contact, message }
		} = await axiosInstance.post(`companies/${companyId}/contacts`, data);
		return {
			contact: ContactMapper.fromDetailDTO(contact),
			message
		};
	}

	async show(id: IContact['id']): Promise<ContactEntity> {
		const {
			data: { contact }
		} = await axiosInstance.get(`contacts/${id}`);
		return ContactEntity.create(contact);
	}

	async update(
		id: IContact['id'],
		data: Partial<ContactEntity>
	): Promise<{ contact: ContactEntity; message: string }> {
		const payload = data.toPlainObject();
		try {
			const {
				data: { contact, message }
			} = await axiosInstance.put(`contacts/${id}`, payload);
			return {
				contact: ContactMapper.fromDetailDTO(contact),
				message
			};
		} catch (error) {
			throw error;
		}
	}

	async delete(id: number): Promise<void> {
		await axiosInstance.delete(`contacts/${id}`);
	}
}
