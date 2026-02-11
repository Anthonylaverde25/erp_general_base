import {
  ICreateBankAccount,
  IUpdateBankAccount,
  IBankAccount,
} from "@/types/bank_account.types";

export class BankAccountEntity implements IBankAccount {
  constructor(
    public id: number,
    public name: string,
    public account_holder: string,
    public account_number: string,
    public swift: string,
    public is_default?: boolean,
    public created_at?: string,
    public updated_at?: string,
  ) { }

  static fromPrimitives(data: IBankAccount): BankAccountEntity {
    return new BankAccountEntity(
      data.id,
      data.name,
      data.account_holder,
      data.account_number,
      data.swift,
      data.is_default,
      data.created_at,
      data.updated_at,
    );
  }

  static create(data: ICreateBankAccount): BankAccountEntity {
    return new BankAccountEntity(
      null as any, // ID will be assigned by backend
      data.name,
      data.account_holder,
      data.account_number,
      data.swift,
      data.is_default,
    );
  }

  static update(id: number, data: IUpdateBankAccount): BankAccountEntity {
    return new BankAccountEntity(
      id,
      data.name,
      data.account_holder,
      data.account_number,
      data.swift,
      data.is_default,
    );
  }

  toPlainObject(): any {
    return {
      id: this.id,
      name: this.name,
      account_holder: this.account_holder,
      account_number: this.account_number,
      swift: this.swift,
      is_default: this.is_default,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
