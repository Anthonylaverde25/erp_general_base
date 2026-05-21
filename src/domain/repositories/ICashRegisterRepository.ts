import {
	ICashRegister,
	ICashRegisterCurrentSession,
	ICloseSessionPayload,
	IOpenSessionPayload,
	IRecordMovementPayload,
	ICreateCashRegisterPayload
} from '@/types/cash-register.types';

export interface ICashRegisterRepository {
	index(): Promise<ICashRegister[]>;
	currentSession(): Promise<ICashRegisterCurrentSession>;
	openSession(payload: IOpenSessionPayload): Promise<{ message?: string }>;
	closeSession(payload: ICloseSessionPayload): Promise<{ message?: string }>;
	recordMovement(payload: IRecordMovementPayload): Promise<{ message?: string }>;
	toggleMovementChecked(movementId: number): Promise<{ message?: string }>;
	create(payload: ICreateCashRegisterPayload): Promise<{ message?: string; data?: ICashRegister }>;
}
