import { Role } from "@/types/role.types";
import { CreateUserType, UserType } from "@/types/user.types";

export class User implements UserType {
    private _id: number | null;
    private _name: string;
    private _email: string;
    private _phone: string;
    private _role: Role | null;
    private _role_ids: number[];




    constructor(Props: Omit<UserType, 'role'> & Partial<Pick<UserType, 'role'>> & Partial<Pick<CreateUserType, 'password' | 'password_confirmation'>>) {

        this._id = Props.id;
        this._name = Props.name;
        this._email = Props.email;
        this._phone = Props.phone;
        this._role = Props.role ?? null;
        this._role_ids = Props.role_ids ?? [];
    }

    get id(): number | null {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get phone(): string {
        return this._phone;
    }

    get role(): Role | null {
        return this._role;
    }

    get role_ids(): number[] {
        return this._role_ids;
    }

    toPlainObject(): UserType {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            role: this._role,
            role_ids: this._role_ids,
            phone: this._phone
        };
    }

    static create(data: CreateUserType): User {
        if (!data) return null
        const { name, email, password, password_confirmation, role_ids, phone } = data
        return new User(
            {
                id: null,
                name,
                email,
                role_ids,
                password,
                password_confirmation,
                phone
            }
        )
    }



}