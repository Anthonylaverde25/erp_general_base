import { PartnerEntity } from '../PartnerEntity';

export interface IPartnerRepository {
	index(type?: string): Promise<PartnerEntity[]>;
	indexSuppliers(): Promise<PartnerEntity[]>;
	show(id: number): Promise<PartnerEntity>;
	create(data: PartnerEntity): Promise<{ partner: PartnerEntity; message: string }>;
	update(id: number, data: PartnerEntity): Promise<{ partner: PartnerEntity; message: string }>;
	delete?(id: number): Promise<void>;
}
