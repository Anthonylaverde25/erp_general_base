export interface Currency {
	id: number;
	code: string;
	name: string;
	symbol: string;
	precision: number;
	active: boolean;
}

export class CurrencyEntity implements Currency {
	constructor(
		public id: number,
		public code: string,
		public name: string,
		public symbol: string,
		public precision: number,
		public active: boolean
	) {}

	static fromPrimitives(data: Currency): CurrencyEntity {
		return new CurrencyEntity(data.id, data.code, data.name, data.symbol, data.precision, data.active);
	}

	toPlainObject(): Currency {
		return {
			id: this.id,
			code: this.code,
			name: this.name,
			symbol: this.symbol,
			precision: this.precision,
			active: this.active
		};
	}
}
