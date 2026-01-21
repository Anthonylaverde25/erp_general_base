/**
 * BankAccount Entity Types
 */
export interface BankAccountType {
  id: number;
  name: string;
  account_holder: string;
  account_number: string;
  swift: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * CreateBankAccountType - Type for creating a new bank account
 */
export interface CreateBankAccountType {
  name: string;
  account_holder: string;
  account_number: string;
  swift: string;
}

/**
 * UpdateBankAccountType - Type for updating an existing bank account
 */
export interface UpdateBankAccountType {
  id: number;
  name: string;
  account_holder: string;
  account_number: string;
  swift: string;
}
