import { IContact } from "@/types/company.types";
import { ContactEntity } from "../Contact";
import { CreateContactDTO } from "../DTOs/CreateContactDTO";

export interface IContactRepository {
    create(companyId: number, data: CreateContactDTO): Promise<{ contact: ContactEntity; message: string }>;
    show(id: IContact['id']): Promise<ContactEntity>;
    update(id: IContact['id'], data: Partial<ContactEntity>): Promise<{ contact: ContactEntity, message: string }>;
    delete(id: number): Promise<void>;
}
