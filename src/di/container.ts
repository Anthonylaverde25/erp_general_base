import { Container } from 'inversify';
import { registerUserModule } from './modules/user.module';
import { registerRoleModule } from './modules/role.module';
import { registerBankAccountModule } from './modules/bank_account.module';
import { registerCompanyModule } from './modules/company.module';
import { registerAddressModule } from './modules/address.module';
import { registerContactModule } from './modules/contact.module';
import { registerPaymentMethodModule } from './modules/payment_method.module';
import { registerStoreModule } from './modules/store.module';
import { registerDocumentTypeModule } from './modules/document_type.module';
import { registerNumberSeriesModule } from './modules/number_series.module';
import { registerTaxTypesModule } from './modules/tax_types.module';
import { registerCategoryModule } from './modules/categories.module';

import { registerTaxRatesModule } from './modules/tax_rates.module';
import { registerFamilyModule } from './modules/family.module';
import { registerPartnerModule } from './modules/partner.module';
import { registerCurrenciesModule } from './modules/currencies.module';
import { registerItemModule } from './modules/item.module';
import { registerCashRegisterModule } from './modules/cash_register.module';
import { registerEmployeeModule } from './modules/employee.module';
import { registerJobPositionModule } from './modules/job_position.module';

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
registerTaxTypesModule(container);
registerCategoryModule(container);
registerTaxRatesModule(container);
registerFamilyModule(container);
registerPartnerModule(container);
registerCurrenciesModule(container);
registerItemModule(container);
registerCashRegisterModule(container);
registerEmployeeModule(container);
registerJobPositionModule(container);

import { UnitTypeModule } from './modules/unit_types.module';
import { UnitsModule } from './modules/units.module';
import { registerDepartmentModule } from './modules/department.module';
import { registerFileTypesModule } from './modules/file_types.module';
import { registerFilesModule } from './modules/files.module';
import { registerDocumentModule } from './modules/document.module';
import { registerBatchModule } from './modules/batches.module';
import { registerSerialReturnsModule } from './modules/serial-returns.module';
import { registerPendingSerializationModule } from './modules/pending-serialization.module';

UnitTypeModule(container);
UnitsModule(container);
registerDepartmentModule(container);
registerFileTypesModule(container);
registerFilesModule(container);
registerDocumentModule(container);
registerBatchModule(container);
registerSerialReturnsModule(container);
registerPendingSerializationModule(container);

export { container };
