import { Container } from 'inversify';
import { registerUserModule } from './modules/user.module';

const container = new Container();

// Registrar módulos
registerUserModule(container)

export { container }

