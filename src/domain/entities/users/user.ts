import { IRole } from '@/types/role.types';
import { ICreateUser, IUpdateUser, IUser } from '@/types/user.types';


export class UserEntity implements IUser {
	private _id: number | null;
	private _name: string;
	private _email: string;
	private _phone: string;
	private _role: IRole | null;
	private _role_id: number;
	private _password: string;
	private _password_confirmation: string;

	constructor(
		Props: Omit<IUser, 'role'> &
			Partial<Pick<IUser, 'role'>> &
			Partial<Pick<ICreateUser, 'password' | 'password_confirmation'>>
	) {
		this._id = Props.id;
		this._name = Props.name;
		this._email = Props.email;
		this._phone = Props.phone;
		this._role = Props.role ?? null;
		this._role_id = Props.role_id ?? 0;
		this._password = Props.password;
		this._password_confirmation = Props.password_confirmation;
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

	get role(): IRole | null {
		return this._role;
	}

	get role_id(): number {
		return this._role_id;
	}

	toPlainObject(): IUser & Partial<ICreateUser> {
		return {
			id: this._id,
			name: this._name,
			email: this._email,
			role: this._role,
			role_id: this._role_id,
			phone: this._phone,
			password: this._password,
			password_confirmation: this._password_confirmation
		};
	}

	static create(data: ICreateUser): UserEntity {
		if (!data) return null;

		const { name, email, password, password_confirmation, role_id, phone } = data;
		return new UserEntity({
			id: null,
			name,
			email,
			role_id,
			password,
			password_confirmation,
			phone
		});
	}

	static update(id: number, data: IUpdateUser): UserEntity {
		if (!data) return null;

		const { name, email, password, password_confirmation, role_id, phone } = data;
		return new UserEntity({
			id,
			name,
			email,
			role_id,
			password,
			password_confirmation,
			phone
		});
	}
}
