import { TaxType, TaxTypeEntity } from "../tax_types/TaxTypeEntity";
import { CreateTaxRateDTO } from "./DTOs/CreateTaxRateDTO";

export interface TaxRate {
    id: number;
    company_id: number;
    name: string;
    percentage: number;
    tax_type_id: number;
    tax_type?: TaxType;
}

export class TaxRateEntity implements TaxRate {
    private _id: number;
    private _company_id: number;
    private _name: string;
    private _percentage: number;
    private _tax_type_id: number;
    private _tax_type?: TaxTypeEntity;

    constructor(
        id: number,
        company_id: number,
        name: string,
        percentage: number,
        tax_type_id: number,
        tax_type?: TaxTypeEntity,
    ) {
        this._id = id;
        this._company_id = company_id;
        this._name = name;
        this._percentage = percentage;
        this._tax_type_id = tax_type_id;
        this._tax_type = tax_type;
    }

    get id(): number {
        return this._id;
    }

    get company_id(): number {
        return this._company_id;
    }

    get name(): string {
        return this._name;
    }

    get percentage(): number {
        return this._percentage;
    }

    get tax_type_id(): number {
        return this._tax_type_id;
    }

    get tax_type(): TaxTypeEntity | undefined {
        return this._tax_type;
    }

    static fromPrimitives(data: TaxRate): TaxRateEntity {
        return new TaxRateEntity(
            data.id,
            data.company_id,
            data.name,
            Number(data.percentage),
            data.tax_type_id,
            data.tax_type ? TaxTypeEntity.fromPrimitives(data.tax_type) : undefined
        );
    }

    static create(data: CreateTaxRateDTO): TaxRateEntity {
        return new TaxRateEntity(
            0, // ID pending from backend
            0, // Company ID pending from backend/context
            data.name,
            data.percentage,
            data.tax_type_id
        );
    }

    static update(id: number, data: Partial<TaxRate>): TaxRateEntity {
        return new TaxRateEntity(
            id,
            data.company_id || 0,
            data.name || "",
            data.percentage || 0,
            data.tax_type_id || 0
        );
    }

    toPlainObject(): TaxRate {
        return {
            id: this._id,
            company_id: this._company_id,
            name: this._name,
            percentage: this._percentage,
            tax_type_id: this._tax_type_id,
            tax_type: this._tax_type ? this._tax_type.toPlainObject() : undefined,
        };
    }
}
