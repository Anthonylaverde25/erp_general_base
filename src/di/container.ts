import { Container } from "inversify";
import { registerUserModule } from "./modules/user.module";
import { registerRoleModule } from "./modules/role.module";
import { registerBankAccountModule } from "./modules/bank_account.module";
import { registerCompanyModule } from "./modules/company.module";
import { registerAddressModule } from "./modules/address.module";
import { registerContactModule } from "./modules/contact.module";
import { registerPaymentMethodModule } from "./modules/payment_method.module";
import { registerStoreModule } from "./modules/store.module";
import { registerDocumentTypeModule } from "./modules/document_type.module";
import { registerNumberSeriesModule } from "./modules/number_series.module";

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
registerDocumentTypeModule(container);
registerNumberSeriesModule(container);

export { container };
