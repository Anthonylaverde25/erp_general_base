import { ICompany, IAddress, IContact } from '@/types/company.types';
import { UpdateCompanyDTO } from './DTOs/UpdateCompanyDTO';
import { CompanySettingEntity } from './CompanySettingEntity';

export class CompanyEntity implements ICompany {
	private _id: number;
	private _name: string;
	private _cif?: string;
	private _max_users?: number;
	private _brandColor?: string;
	private _addresses?: IAddress[];
	private _contacts?: IContact[];
	private _website?: string;
	private _logo_url?: string;
	private _favicon_url?: string;
	private _settings?: CompanySettingEntity;

	constructor(props: ICompany) {
		this._id = props.id;
		this._name = props.name;
		this._cif = props.cif;
		this._max_users = props.max_users;
		this._brandColor = props.brandColor;
		this._addresses = props.addresses;
		this._contacts = props.contacts;
		this._website = props.website;
		this._logo_url = props.logo_url;
		this._favicon_url = props.favicon_url;
		this._settings = props.settings ? new CompanySettingEntity(props.settings) : undefined;
	}

	get id(): number {
		return this._id;
	}

	get settings(): CompanySettingEntity | undefined {
		return this._settings;
	}

	get name(): string {
		return this._name;
	}

	get cif(): string | undefined {
		return this._cif;
	}

	get max_users(): number | undefined {
		return this._max_users;
	}

	get brandColor(): string | undefined {
		return this._brandColor;
	}

	get addresses(): IAddress[] | undefined {
		return this._addresses;
	}

	get contacts(): IContact[] | undefined {
		return this._contacts;
	}

	get website(): string | undefined {
		return this._website;
	}

	get logo_url(): string | undefined {
		return this._logo_url;
	}

	get favicon_url(): string | undefined {
		return this._favicon_url;
	}

	// Legacy getters if needed for compatibility, returning first element or undefined
	get address(): string | undefined {
		return this._addresses?.[0]?.street; // Approximate mapping
	}

	static update(id: number, data: UpdateCompanyDTO) {
		if (!id) {
			throw new Error('No se proporciono un id');
		}

		if (!data) {
			throw new Error('No se proporciono datos');
		}

		return new CompanyEntity({
			id: id,
			name: data.name,
			cif: data.cif
		});
	}

	toPlainObject(): ICompany {
		return {
			id: this._id,
			name: this._name,
			cif: this._cif,
			max_users: this._max_users,
			brandColor: this._brandColor,
			addresses: this._addresses,
			contacts: this._contacts,
			website: this._website,
			logo_url: this._logo_url,
			favicon_url: this._favicon_url,
			settings: this._settings
		};
	}
}
