import { CreateItemDTO, ItemType, ItemTaxRate } from "./DTOs/ItemDTOs";
import { CategoryEntity } from "../categories/CategoryEntity";

export interface Item {
    id: number;
    sku: string;
    name: string;
    type: ItemType;
    unit_name: string;
    category: CategoryEntity;
    sale_price: number;
    is_active: boolean;
    tax_rates: ItemTaxRate[];
    description?: string;
    purchase_price?: number;

}

export class ItemEntity implements Item {
    private _id: number;
    private _sku: string;
    private _name: string;
    private _type: ItemType;
    private _unit_name: string;
    private _category: CategoryEntity;
    private _sale_price: number;
    private _is_active: boolean;
    private _tax_rates: ItemTaxRate[];
    private _description?: string;
    private _purchase_price?: number;

    constructor(
        id: number,
        sku: string,
        name: string,
        type: ItemType,
        unit_name: string,
        category: CategoryEntity,
        sale_price: number,
        is_active: boolean,
        tax_rates: ItemTaxRate[],
        description?: string,
        purchase_price?: number
    ) {
        this._id = id;
        this._sku = sku;
        this._name = name;
        this._type = type;
        this._unit_name = unit_name;
        this._category = category;
        this._sale_price = sale_price;
        this._is_active = is_active;
        this._tax_rates = tax_rates;
        this._description = description;
        this._purchase_price = purchase_price;
    }

    get id(): number { return this._id; }
    get sku(): string { return this._sku; }
    get name(): string { return this._name; }
    get type(): ItemType { return this._type; }
    get unit_name(): string { return this._unit_name; }
    get category(): CategoryEntity { return this._category; }
    get sale_price(): number { return this._sale_price; }
    get is_active(): boolean { return this._is_active; }
    get tax_rates(): ItemTaxRate[] { return this._tax_rates; }
    get description(): string | undefined { return this._description; }
    get purchase_price(): number | undefined { return this._purchase_price; }

    static fromPrimitives(data: any): ItemEntity {
        return new ItemEntity(
            data.id,
            data.sku,
            data.name,
            data.type,
            data.unit_name,
            CategoryEntity.fromPrimitives(data.category),
            Number(data.sale_price),
            Boolean(data.is_active),
            data.tax_rates || [],
            data.description,
            data.purchase_price ? Number(data.purchase_price) : undefined
        );
    }

    static create(data: CreateItemDTO): ItemEntity {
        return new ItemEntity(
            0,
            data.sku,
            data.name,
            data.type,
            "", // unit_name not available on create DTO
            CategoryEntity.create({ name: "" }), // Placeholder category
            data.sale_price,
            data.is_active,
            [], // tax_rates not available on create DTO
            data.description,
            data.purchase_price
        );
    }

    toPlainObject(): Item {
        return {
            id: this._id,
            sku: this._sku,
            name: this._name,
            type: this._type,
            unit_name: this._unit_name,
            category: this._category.toPlainObject(), // Fix type mapping
            sale_price: this._sale_price,
            is_active: this._is_active,
            tax_rates: this._tax_rates,
            description: this._description,
            purchase_price: this._purchase_price
        };
    }
}
