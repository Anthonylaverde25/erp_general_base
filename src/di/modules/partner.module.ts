import { Container } from 'inversify';
import { TYPES } from '../types';
import { IPartnerRepository } from '@/domain/entities/partners/repositories/partner.repository';
import { PartnerRepositoryCrud } from '@/infrastructure/repositories/partners/PartnerRepositoryCrud';
import { IndexPartnersUseCase } from '@/application/use_cases/partners/IndexPartnersUseCase';
import { IndexSupplierPartnersUseCase } from '@/application/use_cases/partners/IndexSupplierPartnersUseCase';
import { ShowPartnerUseCase } from '@/application/use_cases/partners/ShowPartnerUseCase';
import { CreatePartnerUseCase } from '@/application/use_cases/partners/CreatePartnerUseCase';
import { UpdatePartnerUseCase } from '@/application/use_cases/partners/UpdatePartnerUseCase';

export const registerPartnerModule = (container: Container) => {
	container.bind<IPartnerRepository>(TYPES.PartnerRepository).to(PartnerRepositoryCrud);
	container.bind<IndexPartnersUseCase>(TYPES.IndexPartnersUseCase).to(IndexPartnersUseCase);
	container.bind<IndexSupplierPartnersUseCase>(TYPES.IndexSupplierPartnersUseCase).to(IndexSupplierPartnersUseCase);
	container.bind<ShowPartnerUseCase>(TYPES.ShowPartnerUseCase).to(ShowPartnerUseCase);
	container.bind<CreatePartnerUseCase>(TYPES.CreatePartnerUseCase).to(CreatePartnerUseCase);
	container.bind<UpdatePartnerUseCase>(TYPES.UpdatePartnerUseCase).to(UpdatePartnerUseCase);
};
