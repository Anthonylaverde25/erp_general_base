import { IContact } from "@/types/company.types";
import { CreateContactDTO } from "./DTOs/CreateContactDTO";

export class ContactEntity implements IContact {
    constructor(
        public id: number | undefined,
        public email: string,
        public phone: string | undefined,
        public default_contact: boolean,
    ) { }

    // Getter for interface compatibility
    get default(): boolean {
        return this.default_contact;
    }

    static fromPrimitives(data: IContact): ContactEntity {
        return new ContactEntity(
            data.id,
            data.email,
            data.phone,
            data.default || false,
        );
    }

    static create(data: CreateContactDTO): ContactEntity {
        return new ContactEntity(
            undefined,
            data.email,
            data.phone,
            data.default || false,
        );
    }

    static update(id: number, data: Partial<ContactEntity>): ContactEntity {
        return new ContactEntity(
            id,
            data.email!,
            data.phone,
            data.default_contact!
        );
    }

    toPlainObject(): IContact {
        return {
            id: this.id,
            email: this.email,
            phone: this.phone,
            default: this.default_contact,
        };
    }
}
