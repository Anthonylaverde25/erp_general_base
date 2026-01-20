// Dependency Injection Symbols
// Símbolos únicos para identificar las dependencias en el contenedor IoC

export const TYPES = {
	IUserCrudRepository: Symbol.for('IUserCrudRepository'),

	// Use Cases - User
	IndexUserUseCase: Symbol.for('IndexUserUseCase'),
	CreateUserUseCase: Symbol.for('CreateUserUseCase'),
	ShowUserUseCase: Symbol.for('ShowUserUseCase'),
	UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),

	// Roles
	IRoleCrudRepository: Symbol.for('IRoleCrudRepository'),
	IndexRoleUseCase: Symbol.for('IndexRoleUseCase')
};
