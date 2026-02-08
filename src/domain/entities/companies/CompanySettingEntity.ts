import { ICompanySetting } from "@/types/company.types";

export class CompanySettingEntity implements ICompanySetting {
    private _id?: number;
    private _maxUsers: number;
    private _maxStorageMb: number;
    private _currency: string;
    private _timezone: string;

    constructor(props: ICompanySetting) {
        this._id = props.id;
        this._maxUsers = props.maxUsers;
        this._maxStorageMb = props.maxStorageMb;
        this._currency = props.currency;
        this._timezone = props.timezone;
    }


    get id(): number {
        return this._id;
    }

    get maxUsers(): number {
        return this._maxUsers;
    }

    get maxStorageMb(): number {
        return this._maxStorageMb;
    }

    get currency(): string {
        return this._currency;
    }

    get timezone(): string {
        return this._timezone;
    }

    set id(id: number) {
        this._id = id;
    }

    set maxUsers(maxUsers: number) {
        this._maxUsers = maxUsers;
    }

    set maxStorageMb(maxStorageMb: number) {
        this._maxStorageMb = maxStorageMb;
    }

    set currency(currency: string) {
        this._currency = currency;
    }

    set timezone(timezone: string) {
        this._timezone = timezone;
    }


}