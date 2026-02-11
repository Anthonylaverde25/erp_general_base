/**
 * BankAccount Entity Types
 */
/**
 * BankAccount Entity Types
 */
export interface IBankAccount {
  id: number;
  name: string;
  account_holder: string;
  account_number: string;
  swift: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * ICreateBankAccount - Type for creating a new bank account
 */
export interface ICreateBankAccount {
  name: string;
  account_holder: string;
  account_number: string;
  swift: string;
  is_default?: boolean;
}

/**
 * IUpdateBankAccount - Type for updating an existing bank account
 */
export interface IUpdateBankAccount {
  id: number;
  name: string;
  account_holder: string;
  account_number: string;
  swift: string;
  is_default?: boolean;
}
