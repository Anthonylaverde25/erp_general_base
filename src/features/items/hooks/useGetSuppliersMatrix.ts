import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';

export interface SupplierContactDTO {
	id: number;
	email: string | null;
	phone: string | null;
	default: boolean;
}

export interface LastSupplierServiceDTO {
	date: string | null;
	document_id: number;
	document_number: string;
	days_ago: number | null;
}

export interface LastGeneralServiceDTO {
	partner_id: number;
	partner_name: string;
	date: string | null;
	document_id: number;
	document_number: string;
	days_ago: number | null;
}

export interface SupplierMatrixItemDTO {
	association_id: number;
	item_id: number;
	is_default: boolean;
	provider_sku: string | null;
	internal_code: string | null;
	purchase_price: number;
	lead_time_days: number | null;
	min_order_quantity: number;
	is_active: boolean;
	name: string;
	sku: string;
	type: 'physical' | 'service';
	last_supplier_service: LastSupplierServiceDTO | null;
	last_general_service: LastGeneralServiceDTO | null;
}

export interface SupplierMatrixPartnerDTO {
	id: number;
	name: string;
	comercial_name: string | null;
	contacts: SupplierContactDTO[];
	items_count: number;
	items: SupplierMatrixItemDTO[];
}

export interface SuppliersMatrixResponse {
	data: SupplierMatrixPartnerDTO[];
	meta: {
		total: number;
	};
}

interface UseGetSuppliersMatrixParams {
	search?: string;
	partner_id?: string | number;
	is_default?: boolean;
}

export const useGetSuppliersMatrix = (params?: UseGetSuppliersMatrixParams) => {
	return useQuery<SuppliersMatrixResponse, Error>({
		queryKey: ['suppliers-matrix', params],
		queryFn: async () => {
			const { data } = await axiosInstance.get<SuppliersMatrixResponse>('items/suppliers-matrix', {
				params: {
					search: params?.search || undefined,
					partner_id: params?.partner_id || undefined,
					is_default: params?.is_default !== undefined ? params.is_default : undefined
				}
			});
			return data;
		}
	});
};
