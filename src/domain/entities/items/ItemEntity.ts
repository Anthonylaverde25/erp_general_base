import {
	CreateItemDTO,
	ItemDTO,
	ItemInventory,
	ItemPartner,
	ItemType,
	ItemTaxRate,
	UpdateItemDTO
} from './DTOs/ItemDTOs';
import { CategoryEntity } from '../categories/CategoryEntity';
import { CategoryDTO } from '../categories/DTOs/CategoryDTOs';

export interface CreateItemWriteData {
	sku: string;
	name: string;
	type: ItemType;
	unitId?: number;
	categoryId?: number;
	familyId?: number;
	subcategoryId?: number;
	salePrice: number;
	purchasePrice?: number;
	isActive: boolean;
	description?: string;
	taxRateIds?: number[];
	image?: File | null;
	storeId?: number | null;
	initialStock?: number;
	quantity?: number;
	partnerIds?: number[];
	physicalProfile?: {
		barcode?: string;
		weight?: number;
		dimensions?: Record<string, unknown>;
		is_inventoriable?: boolean;
		stock_min?: number;
		has_stock_alert?: boolean;
	};
	serviceProfile?: {
		estimated_time?: number;
		req_scheduling?: boolean;
	};
}

export interface UpdateItemWriteData {
	sku?: string;
	name?: string;
	type?: ItemType;
	unitId?: number;
	categoryId?: number;
	familyId?: number;
	subcategoryId?: number;
	salePrice?: number;
	purchasePrice?: number;
	isActive?: boolean;
	description?: string;
	taxRateIds?: number[];
	image?: File | null;
	storeId?: number | null;
	partnerIds?: number[];
	physicalProfile?: {
		barcode?: string;
		weight?: number;
		dimensions?: Record<string, unknown>;
		is_inventoriable?: boolean;
		stock_min?: number;
		has_stock_alert?: boolean;
	};
	serviceProfile?: {
		estimated_time?: number;
		req_scheduling?: boolean;
	};
}

export interface Item {
	id: number;
	sku: string;
	name: string;
	image?: string;
	type: ItemType;
	unit_id?: number;
	unit_name: string;
	category_id?: number;
	family_id?: number;
	subcategory_id?: number;
	category: CategoryDTO;
	sale_price: number;
	is_active: boolean;
	tax_rates: ItemTaxRate[];
	inventory: ItemInventory[];
	total_stock?: number;
	description?: string;
	purchase_price?: number;
	store_id?: number | null;
	partner_id?: number | null;
	partner_name?: string | null;
	physical_profile?: {
		barcode?: string;
		weight?: number;
		dimensions?: Record<string, unknown>;
		is_inventoriable?: boolean;
		stock_min?: number;
		has_stock_alert?: boolean;
	} | null;
	service_profile?: {
		estimated_time?: number;
		req_scheduling?: boolean;
	} | null;
}

export class ItemEntity implements Item {
	private _id: number;
	private _sku: string;
	private _name: string;
	private _image?: string;
	private _type: ItemType;
	private _unit_id?: number;
	private _unit_name: string;
	private _category_id?: number;
	private _family_id?: number;
	private _subcategory_id?: number;
	private _category: CategoryEntity;
	private _sale_price: number;
	private _is_active: boolean;
	private _tax_rates: ItemTaxRate[];
	private _inventory: ItemInventory[];
	private _total_stock?: number;
	private _description?: string;
	private _purchase_price?: number;
	private _store_id?: number | null;
	private _partner_id?: number | null;
	private _partner_name?: string | null;
	private _partners: ItemPartner[];
	private _physical_profile?: {
		barcode?: string;
		weight?: number;
		dimensions?: Record<string, unknown>;
		is_inventoriable?: boolean;
		stock_min?: number;
		has_stock_alert?: boolean;
	} | null;
	private _service_profile?: {
		estimated_time?: number;
		req_scheduling?: boolean;
	} | null;
	private _createData?: CreateItemWriteData;
	private _updateData?: UpdateItemWriteData;

	constructor(
		id: number,
		sku: string,
		name: string,
		image: string | undefined,
		type: ItemType,
		unit_id: number | undefined,
		unit_name: string,
		category_id: number | undefined,
		family_id: number | undefined,
		subcategory_id: number | undefined,
		category: CategoryEntity,
		sale_price: number,
		is_active: boolean,
		tax_rates: ItemTaxRate[],
		inventory: ItemInventory[],
		total_stock?: number,
		description?: string,
		purchase_price?: number,
		store_id?: number | null,
		partner_id?: number | null,
		partner_name?: string | null,
		partners?: ItemPartner[],
		physical_profile?: {
			barcode?: string;
			weight?: number;
			dimensions?: Record<string, unknown>;
			is_inventoriable?: boolean;
			stock_min?: number;
			has_stock_alert?: boolean;
		} | null,
		service_profile?: {
			estimated_time?: number;
			req_scheduling?: boolean;
		} | null,
		createData?: CreateItemWriteData,
		updateData?: UpdateItemWriteData
	) {
		this._id = id;
		this._sku = sku;
		this._name = name;
		this._image = image;
		this._type = type;
		this._unit_id = unit_id;
		this._unit_name = unit_name;
		this._category_id = category_id;
		this._family_id = family_id;
		this._subcategory_id = subcategory_id;
		this._category = category;
		this._sale_price = sale_price;
		this._is_active = is_active;
		this._tax_rates = tax_rates;
		this._inventory = inventory;
		this._total_stock = total_stock;
		this._description = description;
		this._purchase_price = purchase_price;
		this._store_id = store_id;
		this._partner_id = partner_id;
		this._partner_name = partner_name;
		this._partners = partners ?? [];
		this._physical_profile = physical_profile;
		this._service_profile = service_profile;
		this._createData = createData;
		this._updateData = updateData;
	}

	get id(): number {
		return this._id;
	}
	get sku(): string {
		return this._sku;
	}
	get name(): string {
		return this._name;
	}
	get image(): string | undefined {
		return this._image;
	}
	get type(): ItemType {
		return this._type;
	}
	get unit_id(): number | undefined {
		return this._unit_id;
	}
	get unit_name(): string {
		return this._unit_name;
	}
	get category_id(): number | undefined {
		return this._category_id;
	}
	get family_id(): number | undefined {
		return this._family_id;
	}
	get subcategory_id(): number | undefined {
		return this._subcategory_id;
	}
	get category(): CategoryEntity {
		return this._category;
	}
	get sale_price(): number {
		return this._sale_price;
	}
	get is_active(): boolean {
		return this._is_active;
	}
	get tax_rates(): ItemTaxRate[] {
		return this._tax_rates;
	}
	get inventory(): ItemInventory[] {
		return this._inventory;
	}
	get total_stock(): number | undefined {
		return this._total_stock;
	}
	get description(): string | undefined {
		return this._description;
	}
	get purchase_price(): number | undefined {
		return this._purchase_price;
	}
	get store_id(): number | null | undefined {
		return this._store_id;
	}
	get partner_id(): number | null | undefined {
		return this._partner_id;
	}
	get partner_name(): string | null | undefined {
		return this._partner_name;
	}
	get partners(): ItemPartner[] {
		return this._partners;
	}
	get physical_profile():
		| {
				barcode?: string;
				weight?: number;
				dimensions?: Record<string, unknown>;
				is_inventoriable?: boolean;
				stock_min?: number;
				has_stock_alert?: boolean;
		  }
		| null
		| undefined {
		return this._physical_profile;
	}
	get service_profile():
		| {
				estimated_time?: number;
				req_scheduling?: boolean;
		  }
		| null
		| undefined {
		return this._service_profile;
	}

	static fromPrimitives(data: ItemDTO): ItemEntity {
		const category = data.category
			? CategoryEntity.fromPrimitives(data.category)
			: CategoryEntity.create({ name: data.category_name || 'Sin categoría' });

		return new ItemEntity(
			data.id,
			data.sku,
			data.name,
			data.image,
			data.type,
			data.unit_id,
			data.unit_name,
			data.category_id,
			data.family_id,
			data.subcategory_id,
			category,
			Number(data.sale_price),
			Boolean(data.is_active),
			data.tax_rates || [],
			data.inventory || [],
			data.total_stock,
			data.description,
			data.purchase_price ? Number(data.purchase_price) : undefined,
			data.store_id,
			data.partner_id,
			data.partner_name,
			data.partners ?? [],
			data.physical_profile,
			data.service_profile
		);
	}

	static create(data: CreateItemDTO): ItemEntity {
		const createData: CreateItemWriteData = {
			sku: data.sku,
			name: data.name,
			type: data.type,
			unitId: data.unit_id,
			categoryId: data.category_id,
			familyId: data.family_id,
			subcategoryId: data.subcategory_id,
			salePrice: data.sale_price,
			purchasePrice: data.purchase_price,
			isActive: data.is_active,
			description: data.description,
			taxRateIds: data.tax_rate_ids,
			image: data.image,
			storeId: data.store_id,
			initialStock: data.initial_stock,
			quantity: data.quantity,
			partnerIds: data.partner_ids,
			physicalProfile: data.physical_profile,
			serviceProfile: data.service_profile
		};

		return new ItemEntity(
			0,
			data.sku,
			data.name,
			undefined,
			data.type,
			data.unit_id,
			'', // unit_name not available on create DTO
			data.category_id,
			data.family_id,
			data.subcategory_id,
			CategoryEntity.create({ name: '' }), // Placeholder category
			data.sale_price,
			data.is_active,
			[], // tax_rates not available on create DTO
			[],
			undefined, // total_stock initial state
			data.description,
			data.purchase_price,
			data.store_id,
			data.partner_ids?.[0] ?? null,
			null,
			[], // partners
			data.physical_profile,
			data.service_profile,
			createData
		);
	}

	static update(id: number, data: UpdateItemDTO): ItemEntity {
		const updateData: UpdateItemWriteData = {
			sku: data.sku,
			name: data.name,
			type: data.type,
			unitId: data.unit_id,
			categoryId: data.category_id,
			familyId: data.family_id,
			subcategoryId: data.subcategory_id,
			salePrice: data.sale_price,
			purchasePrice: data.purchase_price,
			isActive: data.is_active,
			description: data.description,
			taxRateIds: data.tax_rate_ids,
			image: data.image,
			storeId: data.store_id,
			partnerIds: data.partner_ids,
			physicalProfile: data.physical_profile,
			serviceProfile: data.service_profile
		};

		return new ItemEntity(
			id,
			data.sku ?? '',
			data.name ?? '',
			undefined,
			data.type ?? 'physical',
			data.unit_id,
			'',
			data.category_id,
			data.family_id,
			data.subcategory_id,
			CategoryEntity.create({ name: '' }),
			data.sale_price ?? 0,
			data.is_active ?? false,
			[],
			[],
			undefined,
			data.description,
			data.purchase_price,
			data.store_id,
			data.partner_ids?.[0] ?? null,
			null,
			[], // partners
			data.physical_profile,
			data.service_profile,
			undefined,
			updateData
		);
	}

	toCreateData(): CreateItemWriteData {
		if (this._createData) {
			return this._createData;
		}

		return {
			sku: this._sku,
			name: this._name,
			type: this._type,
			unitId: this._unit_id,
			categoryId: this._category_id,
			familyId: this._family_id,
			subcategoryId: this._subcategory_id,
			salePrice: this._sale_price,
			purchasePrice: this._purchase_price,
			isActive: this._is_active,
			description: this._description,
			taxRateIds: this._tax_rates.map((taxRate) => taxRate.id),
			storeId: this._store_id,
			partnerIds: this._partner_id ? [this._partner_id] : [],
			physicalProfile: this._physical_profile ?? undefined,
			serviceProfile: this._service_profile ?? undefined
		};
	}

	toUpdateData(): UpdateItemWriteData {
		if (this._updateData) {
			return this._updateData;
		}

		return {
			sku: this._sku,
			name: this._name,
			type: this._type,
			unitId: this._unit_id,
			categoryId: this._category_id,
			familyId: this._family_id,
			subcategoryId: this._subcategory_id,
			salePrice: this._sale_price,
			purchasePrice: this._purchase_price,
			isActive: this._is_active,
			description: this._description,
			taxRateIds: this._tax_rates.map((taxRate) => taxRate.id),
			storeId: this._store_id,
			partnerIds: this._partner_id ? [this._partner_id] : [],
			physicalProfile: this._physical_profile ?? undefined,
			serviceProfile: this._service_profile ?? undefined
		};
	}

	toPlainObject(): Item {
		return {
			id: this._id,
			sku: this._sku,
			name: this._name,
			image: this._image,
			type: this._type,
			unit_id: this._unit_id,
			unit_name: this._unit_name,
			category_id: this._category_id,
			family_id: this._family_id,
			subcategory_id: this._subcategory_id,
			category: this._category.toPlainObject(), // Fix type mapping
			sale_price: this._sale_price,
			is_active: this._is_active,
			tax_rates: this._tax_rates,
			inventory: this._inventory,
			total_stock: this._total_stock,
			description: this._description,
			purchase_price: this._purchase_price,
			store_id: this._store_id,
			partner_id: this._partner_id,
			partner_name: this._partner_name,
			physical_profile: this._physical_profile,
			service_profile: this._service_profile
		};
	}
}
