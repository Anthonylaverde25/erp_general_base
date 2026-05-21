export interface ICashRegister {
	id: number;
	name: string;
	status?: 'active' | 'inactive' | string;
}

export interface ICashRegisterSession {
	id: number;
	cash_register_id: number;
	opened_by_id?: number;
	closed_by_id?: number | null;
	opened_at: string;
	closed_at?: string | null;
	opening_balance: number;
	closing_balance_real?: number | null;
	status?: 'open' | 'closed' | string;
}

export interface ICashRegisterMovement {
	id: number | string;
	direction?: 'in' | 'out' | string;
	type: 'deposit' | 'withdrawal' | string;
	amount: number;
	notes?: string;
	created_at: string;
	payment_method?: string;
}

export interface ICashRegisterSummary {
	opening_balance: number;
	total_inflows: number;
	total_outflows: number;
	calculated_balance: number;
}

export interface ICashRegisterCurrentSession {
	active: boolean;
	cash_register_name?: string | null;
	session?: ICashRegisterSession | null;
	summary: ICashRegisterSummary;
	movements: ICashRegisterMovement[];
}

export interface IOpenSessionPayload {
	cash_register_id: number;
	notes?: string;
}

export interface ICloseSessionPayload {
	closing_balance_real: number;
	notes?: string;
}

export interface IRecordMovementPayload {
	type: 'deposit' | 'withdrawal';
	amount: number;
	payment_method_id?: number;
	notes?: string;
}
