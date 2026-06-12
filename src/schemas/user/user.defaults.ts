import { CreateUserFormType, UpdateUserFormType } from './user.schema';
import { IUser } from '@/types/user.types';

export const defaultCreateUserValues: CreateUserFormType = {
	name: '',
	last_name: '',
	email: '',
	password: '',
	password_confirmation: '',
	role_id: 0,
	phone: '',
	department_id: 0,
	job_position_id: 0,
	document_type: 'DNI',
	document_number: ''
};

export const defaultUpdateUserValues = (user?: IUser): UpdateUserFormType => ({
	id: user?.id || 0,
	name: user?.name || '',
	email: user?.email || '',
	role_id: user?.role_id || 0,
	phone: user?.phone || '',
	password: '',
	password_confirmation: ''
});
