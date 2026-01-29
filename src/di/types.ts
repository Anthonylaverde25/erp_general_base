// Dependency Injection Symbols
// Símbolos únicos para identificar las dependencias en el contenedor IoC

export const TYPES = {
  IUserCrudRepository: Symbol.for("IUserCrudRepository"),

  // Use Cases - User
  IndexUserUseCase: Symbol.for("IndexUserUseCase"),
  CreateUserUseCase: Symbol.for("CreateUserUseCase"),
  ShowUserUseCase: Symbol.for("ShowUserUseCase"),
  UpdateUserUseCase: Symbol.for("UpdateUserUseCase"),

  // Roles
  IRoleCrudRepository: Symbol.for("IRoleCrudRepository"),
  IndexRoleUseCase: Symbol.for("IndexRoleUseCase"),
  CreateRoleUseCase: Symbol.for("CreateRoleUseCase"),
  UpdateRoleUseCase: Symbol.for("UpdateRoleUseCase"),
  ShowRoleUseCase: Symbol.for("ShowRoleUseCase"),

  // Bank Accounts
  IBankAccountCrudRepository: Symbol.for("IBankAccountCrudRepository"),
  IndexBankAccountUseCase: Symbol.for("IndexBankAccountUseCase"),
  CreateBankAccountUseCase: Symbol.for("CreateBankAccountUseCase"),
  UpdateBankAccountUseCase: Symbol.for("UpdateBankAccountUseCase"),
  ShowBankAccountUseCase: Symbol.for("ShowBankAccountUseCase"),

  // Companies
  ICompanyCrudRepository: Symbol.for("ICompanyCrudRepository"),
  ICompanyActionRepository: Symbol.for("ICompanyActionRepository"),
  IndexCompanyUseCase: Symbol.for("IndexCompanyUseCase"),
  ShowCompanyUseCase: Symbol.for("ShowCompanyUseCase"),
  ChangeCompanyUseCase: Symbol.for("ChangeCompanyUseCase"),
  UpdateCompanyUseCase: Symbol.for("UpdateCompanyUseCase"),
  CreateAddressUseCase: Symbol.for("CreateAddressUseCase"),
};
