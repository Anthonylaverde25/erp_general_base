export interface JobPositionEntity {
	id: number;
	company_id: number;
	department_id: number;
	name: string;
	code: string;
	description?: string | null;
	is_active: boolean;
}
