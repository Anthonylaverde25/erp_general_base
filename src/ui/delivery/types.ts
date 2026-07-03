export interface MockOrder {
	id: string;
	documentId: number;
	customer: string;
	address: string;
	status: 'In Transit' | 'Pending' | 'Delayed';
	eta: string;
	distance: string;
	lat: number;
	lng: number;
	warning?: string;
}
