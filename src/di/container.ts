import { Container } from 'inversify';
import { registerUserModule } from './modules/user.module';
import { registerRoleModule } from './modules/role.module';

const container = new Container();

// Registrar módulos
registerUserModule(container);
registerRoleModule(container);

export { container };
