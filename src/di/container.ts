import { Container } from "inversify";
import { registerUserModule } from "./modules/user.module";
import { registerRoleModule } from "./modules/role.module";
import { registerBankAccountModule } from "./modules/bank_account.module";
import { registerCompanyModule } from "./modules/company.module";
import { registerAddressModule } from "./modules/address.module";
import { registerContactModule } from "./modules/contact.module";
import { registerPaymentMethodModule } from "./modules/payment_method.module";
import { registerStoreModule } from "./modules/store.module";

const container = new Container();

// Registrar módulos
registerUserModule(container);
registerRoleModule(container);
registerBankAccountModule(container);
registerCompanyModule(container);
registerAddressModule(container);
registerContactModule(container);
registerPaymentMethodModule(container);
registerStoreModule(container);

export { container };
