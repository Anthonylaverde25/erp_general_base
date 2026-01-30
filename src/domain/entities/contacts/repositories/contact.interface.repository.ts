import { Contact } from "@/types/company.types";
import { ContactEntity } from "../Contact";
import { CreateContactDTO } from "../DTOs/CreateContactDTO";

export interface IContactRepository {
    create(companyId: number, data: CreateContactDTO): Promise<{ contact: ContactEntity; message: string }>;
    show(id: Contact['id']): Promise<ContactEntity>;
    update(id: Contact['id'], data: Partial<ContactEntity>): Promise<{ contact: ContactEntity, message: string }>;
    delete(id: number): Promise<void>;
}
