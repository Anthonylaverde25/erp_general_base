export interface CreateTaxTypeDTO {
	code: string;
	name: string;
	description: string;
	is_active: boolean;
	operation: string;
	operation_label?: string;
}
