export interface BankAccountListDTO {
	id: number;
	name: string;
	account_holder: string;
	account_number: string;
	swift: string;
	created_at?: string;
	updated_at?: string;
}
