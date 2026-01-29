import { Container } from "inversify";
import { registerUserModule } from "./modules/user.module";
import { registerRoleModule } from "./modules/role.module";
import { registerBankAccountModule } from "./modules/bank_account.module";
import { registerCompanyModule } from "./modules/company.module";
import { registerAddressModule } from "./modules/address.module";

const container = new Container();

// Registrar módulos
registerUserModule(container);
registerRoleModule(container);
registerBankAccountModule(container);
registerCompanyModule(container);
registerAddressModule(container);

export { container };
