export interface TaxType {
    id: number;
    company_id: number;
    code: string;
    name: string;
    description: string;
    is_active: boolean;
    operation: string;
    operation_label?: string;
}

export class TaxTypeEntity implements TaxType {
    constructor(
        public id: number,
        public company_id: number,
        public code: string,
        public name: string,
        public description: string,
        public is_active: boolean,
        public operation: string,
        public operation_label?: string,
    ) { }

    static fromPrimitives(data: TaxType): TaxTypeEntity {
        return new TaxTypeEntity(
            data.id,
            data.company_id,
            data.code,
            data.name,
            data.description,
            data.is_active,
            data.operation,
            data.operation_label,
        );
    }

    toPlainObject(): TaxType {
        return {
            id: this.id,
            company_id: this.company_id,
            code: this.code,
            name: this.name,
            description: this.description,
            is_active: this.is_active,
            operation: this.operation,
            operation_label: this.operation_label,
        };
    }
}
