import { CreateFamilyDTO } from "./DTOs/FamilyDTOs";
import { TaxRate, TaxRateEntity } from "../tax_rates/TaxRateEntity";

export interface Family {
    id: number;
    company_id: number;
    tax_rate_ids: number[];
    name: string;
    percentage: number;
    is_active: boolean;
    tax_rates?: TaxRate[];
}

export class FamilyEntity implements Family {
    private _id: number;
    private _company_id: number;
    private _tax_rate_ids: number[];
    private _name: string;
    private _percentage: number;
    private _is_active: boolean;
    private _tax_rates?: TaxRateEntity[];

    constructor(
        id: number,
        company_id: number,
        tax_rate_ids: number[],
        name: string,
        percentage: number,
        is_active: boolean,
        tax_rates?: TaxRateEntity[]
    ) {
        this._id = id;
        this._company_id = company_id;
        this._tax_rate_ids = tax_rate_ids;
        this._name = name;
        this._percentage = percentage;
        this._is_active = is_active;
        this._tax_rates = tax_rates;
    }

    get id(): number {
        return this._id;
    }

    get company_id(): number {
        return this._company_id;
    }

    get tax_rate_ids(): number[] {
        return this._tax_rate_ids;
    }

    get name(): string {
        return this._name;
    }

    get percentage(): number {
        return this._percentage;
    }

    get is_active(): boolean {
        return this._is_active;
    }

    get tax_rates(): TaxRateEntity[] | undefined {
        return this._tax_rates;
    }

    static fromPrimitives(data: Family): FamilyEntity {
        return new FamilyEntity(
            data.id,
            data.company_id,
            data.tax_rate_ids || [],
            data.name,
            Number(data.percentage),
            data.is_active,
            data.tax_rates
                ? data.tax_rates.map((rate) => TaxRateEntity.fromPrimitives(rate))
                : undefined
        );
    }

    static create(data: CreateFamilyDTO): FamilyEntity {
        return new FamilyEntity(
            0,
            0,
            data.tax_rate_ids,
            data.name,
            data.percentage,
            data.is_active,
            undefined
        );
    }

    static update(id: number, data: Partial<Family>): FamilyEntity {
        return new FamilyEntity(
            id,
            data.company_id || 0,
            data.tax_rate_ids || [],
            data.name || "",
            data.percentage || 0,
            data.is_active !== undefined ? data.is_active : true,
            data.tax_rates
                ? data.tax_rates.map((rate) => TaxRateEntity.fromPrimitives(rate))
                : undefined
        );
    }

    toPlainObject(): Family {
        return {
            id: this._id,
            company_id: this._company_id,
            tax_rate_ids: this._tax_rate_ids,
            name: this._name,
            percentage: this._percentage,
            is_active: this._is_active,
            tax_rates: this._tax_rates
                ? this._tax_rates.map((rate) => rate.toPlainObject())
                : undefined,
        };
    }
}
