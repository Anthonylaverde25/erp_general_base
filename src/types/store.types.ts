import { IAddress } from '@/types/company.types';

export interface IStore {
	id?: number;
	company_id?: number;
	name: string;
	code?: string;
	is_active: boolean;
	address?: IAddress;
}

export type Store = IStore;
