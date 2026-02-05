export interface TaxType {
    id: number;
    company_id: number;
    code: string;
    name: string;
    description: string;
    is_active: boolean;
}

export class TaxTypeEntity implements TaxType {
    constructor(
        public id: number,
        public company_id: number,
        public code: string,
        public name: string,
        public description: string,
        public is_active: boolean,
    ) { }

    static fromPrimitives(data: TaxType): TaxTypeEntity {
        return new TaxTypeEntity(
            data.id,
            data.company_id,
            data.code,
            data.name,
            data.description,
            data.is_active,
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
        };
    }
}
