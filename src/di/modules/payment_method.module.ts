import { Container } from 'inversify';
import { TYPES } from '@/di/types';
import { PaymentMethodRepositoryCrud } from '@/infrastructure/repositories/payment_methods/PaymentMethodRepositoryCrud';
import { IPaymentMethodRepository } from '@/domain/entities/payment_methods/repositories/payment_method.interface.repository';
import { IPaymentMethodActionRepository } from '@/domain/entities/payment_methods/repositories/payment_method.action.repository';
import { PaymentMethodRepositoryAction } from '@/infrastructure/repositories/payment_methods/PaymentMethodRepositoryAction';
import { IndexPaymentMethodsUseCase } from '@/application/use_cases/payment_methods/IndexPaymentMethodsUseCase';
import { CreatePaymentMethodUseCase } from '@/application/use_cases/payment_methods/CreatePaymentMethodUseCase';
import { ShowPaymentMethodUseCase } from '@/application/use_cases/payment_methods/ShowPaymentMethodUseCase';
import { UpdatePaymentMethodUseCase } from '@/application/use_cases/payment_methods/UpdatePaymentMethodUseCase';
import { DeletePaymentMethodUseCase } from '@/application/use_cases/payment_methods/DeletePaymentMethodUseCase';
import { TogglePaymentMethodStatusUseCase } from '@/application/use_cases/payment_methods/TogglePaymentMethodStatusUseCase';

export const registerPaymentMethodModule = (container: Container) => {
	// Repository
	container
		.bind<IPaymentMethodRepository>(TYPES.IPaymentMethodRepository)
		.to(PaymentMethodRepositoryCrud)
		.inSingletonScope();
	container
		.bind<IPaymentMethodActionRepository>(TYPES.IPaymentMethodActionRepository)
		.to(PaymentMethodRepositoryAction);

	// Use Cases
	container.bind<IndexPaymentMethodsUseCase>(TYPES.IndexPaymentMethodsUseCase).to(IndexPaymentMethodsUseCase);
	container.bind<CreatePaymentMethodUseCase>(TYPES.CreatePaymentMethodUseCase).to(CreatePaymentMethodUseCase);
	container.bind<ShowPaymentMethodUseCase>(TYPES.ShowPaymentMethodUseCase).to(ShowPaymentMethodUseCase);
	container.bind<UpdatePaymentMethodUseCase>(TYPES.UpdatePaymentMethodUseCase).to(UpdatePaymentMethodUseCase);
	container.bind<DeletePaymentMethodUseCase>(TYPES.DeletePaymentMethodUseCase).to(DeletePaymentMethodUseCase);
	container
		.bind<TogglePaymentMethodStatusUseCase>(TYPES.TogglePaymentMethodStatusUseCase)
		.to(TogglePaymentMethodStatusUseCase);
};
