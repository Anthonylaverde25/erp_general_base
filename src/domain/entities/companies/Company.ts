import { Company as ICompany } from '@/types/company.types';

export class Company implements ICompany {
    private _id: number;
    private _name: string;
    private _address: string;
    private _website?: string;
    private _logo_url?: string;

    constructor(props: ICompany) {
        this._id = props.id;
        this._name = props.name;
        this._address = props.address;
        this._website = props.website;
        this._logo_url = props.logo_url;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get address(): string {
        return this._address;
    }

    get website(): string | undefined {
        return this._website;
    }

    get logo_url(): string | undefined {
        return this._logo_url;
    }

    toPlainObject(): ICompany {
        return {
            id: this._id,
            name: this._name,
            address: this._address,
            website: this._website,
            logo_url: this._logo_url
        };
    }
}
