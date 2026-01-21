import { Container } from "inversify";
import { registerUserModule } from "./modules/user.module";
import { registerRoleModule } from "./modules/role.module";
import { registerBankAccountModule } from "./modules/bank_account.module";

const container = new Container();

// Registrar módulos
registerUserModule(container);
registerRoleModule(container);
registerBankAccountModule(container);

export { container };
