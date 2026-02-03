import { PaymentMethod } from "@/types/payment_method.types";
import { CreatePaymentMethodDTO } from "./DTOs/CreatePaymentMethodDTO";

export class PaymentMethodEntity implements PaymentMethod {
    constructor(
        public id: number | undefined,
        public company_id: number | undefined,
        public name: string,
        public type: string,
        public description: string | undefined,
        public details: any,
        public is_active: boolean,
    ) { }

    static fromPrimitives(data: PaymentMethod): PaymentMethodEntity {
        return new PaymentMethodEntity(
            data.id,
            data.company_id,
            data.name,
            data.type,
            data.description,
            data.details,
            data.is_active ?? true,
        );
    }

    static create(data: CreatePaymentMethodDTO): PaymentMethodEntity {
        return new PaymentMethodEntity(
            undefined,
            undefined,
            data.name,
            data.type,
            data.description,
            data.details,
            data.is_active ?? true,
        );
    }

    static update(id: number, data: Partial<PaymentMethodEntity>): PaymentMethodEntity {
        return new PaymentMethodEntity(
            id,
            data.company_id,
            data.name!,
            data.type!,
            data.description,
            data.details,
            data.is_active!
        );
    }

    toPlainObject(): PaymentMethod {
        return {
            id: this.id,
            company_id: this.company_id,
            name: this.name,
            type: this.type,
            description: this.description,
            details: this.details,
            is_active: this.is_active,
        };
    }
}
