export interface CompanySettingDTO {
	id: number;
	company_id: number;
	max_users: number;
	max_storage_mb: number;
	currency: string;
	time_zone: string;
	default_store_id?: number | null;
}
