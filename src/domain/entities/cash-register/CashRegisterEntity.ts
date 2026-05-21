import { ICashRegisterCurrentSession } from '@/types/cash-register.types';

export class CashRegisterEntity {
	constructor(private readonly data: ICashRegisterCurrentSession) {}

	static fromPrimitives(data: ICashRegisterCurrentSession): CashRegisterEntity {
		return new CashRegisterEntity(data);
	}

	toPrimitives(): ICashRegisterCurrentSession {
		return this.data;
	}
}
