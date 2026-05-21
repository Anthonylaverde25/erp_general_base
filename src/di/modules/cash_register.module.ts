import { Container } from 'inversify';
import { TYPES } from '@/di/types';
import { ICashRegisterRepository } from '@/domain/repositories/ICashRegisterRepository';
import { CashRegisterRepositoryImpl } from '@/infrastructure/repositories/cash-register/CashRegisterRepositoryImpl';
import { CurrentSessionUseCase } from '@/application/cash-register/CurrentSessionUseCase';
import { OpenSessionUseCase } from '@/application/cash-register/OpenSessionUseCase';
import { CloseSessionUseCase } from '@/application/cash-register/CloseSessionUseCase';
import { RecordMovementUseCase } from '@/application/cash-register/RecordMovementUseCase';
import { IndexCashRegistersUseCase } from '@/application/cash-register/IndexCashRegistersUseCase';

export const registerCashRegisterModule = (container: Container) => {
	container.bind<ICashRegisterRepository>(TYPES.ICashRegisterRepository).to(CashRegisterRepositoryImpl).inSingletonScope();
	container.bind<CurrentSessionUseCase>(TYPES.CurrentSessionUseCase).to(CurrentSessionUseCase);
	container.bind<OpenSessionUseCase>(TYPES.OpenSessionUseCase).to(OpenSessionUseCase);
	container.bind<CloseSessionUseCase>(TYPES.CloseSessionUseCase).to(CloseSessionUseCase);
	container.bind<RecordMovementUseCase>(TYPES.RecordMovementUseCase).to(RecordMovementUseCase);
	container.bind<IndexCashRegistersUseCase>(TYPES.IndexCashRegistersUseCase).to(IndexCashRegistersUseCase);
};
