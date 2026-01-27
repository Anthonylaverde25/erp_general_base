import { Company as ICompany, Address, Contact } from '@/types/company.types';

export class Company implements ICompany {
    private _id: number;
    private _name: string;
    private _cif?: string;
    private _addresses?: Address[];
    private _contacts?: Contact[];
    private _website?: string;
    private _logo_url?: string;

    constructor(props: ICompany) {
        this._id = props.id;
        this._name = props.name;
        this._cif = props.cif;
        this._addresses = props.addresses;
        this._contacts = props.contacts;
        this._website = props.website;
        this._logo_url = props.logo_url;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get cif(): string | undefined {
        return this._cif;
    }

    get addresses(): Address[] | undefined {
        return this._addresses;
    }

    get contacts(): Contact[] | undefined {
        return this._contacts;
    }

    get website(): string | undefined {
        return this._website;
    }

    get logo_url(): string | undefined {
        return this._logo_url;
    }

    // Legacy getters if needed for compatibility, returning first element or undefined
    get address(): string | undefined {
        return this._addresses?.[0]?.street; // Approximate mapping
    }

    toPlainObject(): ICompany {
        return {
            id: this._id,
            name: this._name,
            cif: this._cif,
            addresses: this._addresses,
            contacts: this._contacts,
            website: this._website,
            logo_url: this._logo_url
        };
    }
}
