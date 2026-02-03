import { Container } from 'inversify';
import { TYPES } from '@/di/types';
import { PaymentMethodRepositoryCrud } from '@/infrastructure/repositories/payment_methods/PaymentMethodRepositoryCrud';
import { IPaymentMethodRepository } from '@/domain/entities/payment_methods/repositories/payment_method.interface.repository';
import { IndexPaymentMethodsUseCase } from '@/application/use_cases/payment_methods/IndexPaymentMethodsUseCase';
import { CreatePaymentMethodUseCase } from '@/application/use_cases/payment_methods/CreatePaymentMethodUseCase';
import { ShowPaymentMethodUseCase } from '@/application/use_cases/payment_methods/ShowPaymentMethodUseCase';
import { UpdatePaymentMethodUseCase } from '@/application/use_cases/payment_methods/UpdatePaymentMethodUseCase';
import { DeletePaymentMethodUseCase } from '@/application/use_cases/payment_methods/DeletePaymentMethodUseCase';

export const registerPaymentMethodModule = (container: Container) => {
    // Repository
    container.bind<IPaymentMethodRepository>(TYPES.IPaymentMethodRepository).to(PaymentMethodRepositoryCrud).inSingletonScope();

    // Use Cases
    container.bind<IndexPaymentMethodsUseCase>(TYPES.IndexPaymentMethodsUseCase).to(IndexPaymentMethodsUseCase);
    container.bind<CreatePaymentMethodUseCase>(TYPES.CreatePaymentMethodUseCase).to(CreatePaymentMethodUseCase);
    container.bind<ShowPaymentMethodUseCase>(TYPES.ShowPaymentMethodUseCase).to(ShowPaymentMethodUseCase);
    container.bind<UpdatePaymentMethodUseCase>(TYPES.UpdatePaymentMethodUseCase).to(UpdatePaymentMethodUseCase);
    container.bind<DeletePaymentMethodUseCase>(TYPES.DeletePaymentMethodUseCase).to(DeletePaymentMethodUseCase);
};
