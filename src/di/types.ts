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
	IndexRoleUseCase: Symbol.for('IndexRoleUseCase'),
	CreateRoleUseCase: Symbol.for('CreateRoleUseCase'),
	UpdateRoleUseCase: Symbol.for('UpdateRoleUseCase'),
	ShowRoleUseCase: Symbol.for('ShowRoleUseCase'),

	// Bank Accounts
	IBankAccountCrudRepository: Symbol.for('IBankAccountCrudRepository'),
	IndexBankAccountUseCase: Symbol.for('IndexBankAccountUseCase'),
	CreateBankAccountUseCase: Symbol.for('CreateBankAccountUseCase'),
	UpdateBankAccountUseCase: Symbol.for('UpdateBankAccountUseCase'),
	ShowBankAccountUseCase: Symbol.for('ShowBankAccountUseCase'),

	// Companies
	ICompanyCrudRepository: Symbol.for('ICompanyCrudRepository'),
	ICompanyActionRepository: Symbol.for('ICompanyActionRepository'),
	IndexCompanyUseCase: Symbol.for('IndexCompanyUseCase'),
	ShowCompanyUseCase: Symbol.for('ShowCompanyUseCase'),
	ChangeCompanyUseCase: Symbol.for('ChangeCompanyUseCase'),
	UpdateCompanyUseCase: Symbol.for('UpdateCompanyUseCase'),
	CreateAddressUseCase: Symbol.for('CreateAddressUseCase'),
	ChangeDefaultAddressUseCase: Symbol.for('ChangeDefaultAddressUseCase'),
	ChangeDefaultContactUseCase: Symbol.for('ChangeDefaultContactUseCase'),

	// Addresses
	IAddressRepository: Symbol.for('IAddressRepository'),
	ShowAddressUseCase: Symbol.for('ShowAddressUseCase'),
	UpdateAddressUseCase: Symbol.for('UpdateAddressUseCase'),
	DeleteAddressUseCase: Symbol.for('DeleteAddressUseCase'),

	// Contacts
	IContactRepository: Symbol.for('IContactRepository'),
	ShowContactUseCase: Symbol.for('ShowContactUseCase'),
	UpdateContactUseCase: Symbol.for('UpdateContactUseCase'),
	CreateContactUseCase: Symbol.for('CreateContactUseCase'),
	DeleteContactUseCase: Symbol.for('DeleteContactUseCase'),
	RemoveAddressUseCase: Symbol.for('RemoveAddressUseCase'),

	// Payment Methods
	IPaymentMethodRepository: Symbol.for('IPaymentMethodRepository'),
	IndexPaymentMethodsUseCase: Symbol.for('IndexPaymentMethodsUseCase'),
	CreatePaymentMethodUseCase: Symbol.for('CreatePaymentMethodUseCase'),
	ShowPaymentMethodUseCase: Symbol.for('ShowPaymentMethodUseCase'),
	UpdatePaymentMethodUseCase: Symbol.for('UpdatePaymentMethodUseCase'),
	DeletePaymentMethodUseCase: Symbol.for('DeletePaymentMethodUseCase'),
	IPaymentMethodActionRepository: Symbol.for('IPaymentMethodActionRepository'),
	TogglePaymentMethodStatusUseCase: Symbol.for('TogglePaymentMethodStatusUseCase'),

	// Stores
	IStoreRepository: Symbol.for('IStoreRepository'),
	IndexStoresUseCase: Symbol.for('IndexStoresUseCase'),
	CreateStoreUseCase: Symbol.for('CreateStoreUseCase'),
	ShowStoreUseCase: Symbol.for('ShowStoreUseCase'),
	UpdateStoreUseCase: Symbol.for('UpdateStoreUseCase'),
	DeleteStoreUseCase: Symbol.for('DeleteStoreUseCase'),
	IStoreActionRepository: Symbol.for('IStoreActionRepository'),
	ToggleStoreStatusUseCase: Symbol.for('ToggleStoreStatusUseCase'),

	// Document Types
	IDocumentTypeRepository: Symbol.for('IDocumentTypeRepository'),
	IndexDocumentTypesUseCase: Symbol.for('IndexDocumentTypesUseCase'),
	IndexDocumentTypesByModuleUseCase: Symbol.for('IndexDocumentTypesByModuleUseCase'),

	// Number Series
	INumberSeriesRepository: Symbol.for('INumberSeriesRepository'),
	IndexNumberSeriesUseCase: Symbol.for('IndexNumberSeriesUseCase'),
	CreateNumberSeriesUseCase: Symbol.for('CreateNumberSeriesUseCase'),
	UpdateNumberSeriesUseCase: Symbol.for('UpdateNumberSeriesUseCase'),

	// Tax Types
	ITaxTypeRepository: Symbol.for('ITaxTypeRepository'),
	IndexTaxTypesUseCase: Symbol.for('IndexTaxTypesUseCase'),
	CreateTaxTypeUseCase: Symbol.for('CreateTaxTypeUseCase'),
	UpdateTaxTypeUseCase: Symbol.for('UpdateTaxTypeUseCase'),
	ToggleTaxTypeStatusUseCase: Symbol.for('ToggleTaxTypeStatusUseCase'),

	// Tax Rates
	ITaxRateRepository: Symbol.for('ITaxRateRepository'),
	IndexTaxRatesUseCase: Symbol.for('IndexTaxRatesUseCase'),
	CreateTaxRateUseCase: Symbol.for('CreateTaxRateUseCase'),
	UpdateTaxRateUseCase: Symbol.for('UpdateTaxRateUseCase'),
	// Families
	FamilyRepository: Symbol.for('FamilyRepository'),
	IndexFamiliesUseCase: Symbol.for('IndexFamiliesUseCase'),
	CreateFamilyUseCase: Symbol.for('CreateFamilyUseCase'),
	UpdateFamilyUseCase: Symbol.for('UpdateFamilyUseCase'),
	ShowFamilyUseCase: Symbol.for('ShowFamilyUseCase'),
	IFamilyActionRepository: Symbol.for('IFamilyActionRepository'),
	ToggleFamilyStatusUseCase: Symbol.for('ToggleFamilyStatusUseCase'),

	// Partners
	PartnerRepository: Symbol.for('PartnerRepository'),
	IndexPartnersUseCase: Symbol.for('IndexPartnersUseCase'),
	IndexSupplierPartnersUseCase: Symbol.for('IndexSupplierPartnersUseCase'),
	ShowPartnerUseCase: Symbol.for('ShowPartnerUseCase'),
	CreatePartnerUseCase: Symbol.for('CreatePartnerUseCase'),
	UpdatePartnerUseCase: Symbol.for('UpdatePartnerUseCase'),

	// Currencies
	ICurrencyRepository: Symbol.for('ICurrencyRepository'),
	IndexCurrenciesUseCase: Symbol.for('IndexCurrenciesUseCase'),

	// Items
	ItemRepository: Symbol.for('ItemRepository'),
	IItemActionRepository: Symbol.for('IItemActionRepository'),
	IndexItemsUseCase: Symbol.for('IndexItemsUseCase'),
	ShowItemUseCase: Symbol.for('ShowItemUseCase'),
	CreateItemUseCase: Symbol.for('CreateItemUseCase'),
	UpdateItemUseCase: Symbol.for('UpdateItemUseCase'),
	UpdateStockAlertUseCase: Symbol.for('UpdateStockAlertUseCase'),
	RegisterStockMovementUseCase: Symbol.for('RegisterStockMovementUseCase'),
	AdjustStockEntryUseCase: Symbol.for('AdjustStockEntryUseCase'),

	// Categories
	CategoryRepository: Symbol.for('CategoryRepository'),
	IndexCategoriesUseCase: Symbol.for('IndexCategoriesUseCase'),
	CreateCategoryUseCase: Symbol.for('CreateCategoryUseCase'),
	UpdateCategoryUseCase: Symbol.for('UpdateCategoryUseCase'),
	ShowCategoryUseCase: Symbol.for('ShowCategoryUseCase'),
	CategoryActionRepository: Symbol.for('CategoryActionRepository'),
	ToggleCategoryStatusUseCase: Symbol.for('ToggleCategoryStatusUseCase'),

	// Unit Types
	UnitTypeRepository: Symbol.for('UnitTypeRepository'),
	IndexUnitTypesUseCase: Symbol.for('IndexUnitTypesUseCase'),
	CreateUnitTypeUseCase: Symbol.for('CreateUnitTypeUseCase'),
	UpdateUnitTypeUseCase: Symbol.for('UpdateUnitTypeUseCase'),
	DeleteUnitTypeUseCase: Symbol.for('DeleteUnitTypeUseCase'),

	// Units
	UnitRepository: Symbol.for('UnitRepository'),
	IndexUnitsUseCase: Symbol.for('IndexUnitsUseCase'),
	CreateUnitUseCase: Symbol.for('CreateUnitUseCase'),
	UpdateUnitUseCase: Symbol.for('UpdateUnitUseCase'),
	DeleteUnitUseCase: Symbol.for('DeleteUnitUseCase'),

	// File Types
	FileTypeRepository: Symbol.for('FileTypeRepository'),
	IndexFileTypesUseCase: Symbol.for('IndexFileTypesUseCase'),
	CreateFileTypeUseCase: Symbol.for('CreateFileTypeUseCase'),
	UpdateFileTypeUseCase: Symbol.for('UpdateFileTypeUseCase'),
	DeleteFileTypeUseCase: Symbol.for('DeleteFileTypeUseCase'),

	// Files (Polymorphic)
	FileRepository: Symbol.for('FileRepository'),
	GetFilesByFileableUseCase: Symbol.for('GetFilesByFileableUseCase'),
	UploadFileUseCase: Symbol.for('UploadFileUseCase'),
	DeleteFileUseCase: Symbol.for('DeleteFileUseCase'),
	DownloadFileUseCase: Symbol.for('DownloadFileUseCase'),
	ViewFileUseCase: Symbol.for('ViewFileUseCase'),
	PreviewJsonFileUseCase: Symbol.for('PreviewJsonFileUseCase'),

	// Departments
	IDepartmentRepository: Symbol.for('IDepartmentRepository'),
	IndexDepartmentsUseCase: Symbol.for('IndexDepartmentsUseCase'),
	ShowDepartmentUseCase: Symbol.for('ShowDepartmentUseCase'),
	CreateDepartmentUseCase: Symbol.for('CreateDepartmentUseCase'),
	UpdateDepartmentUseCase: Symbol.for('UpdateDepartmentUseCase'),
	DeleteDepartmentUseCase: Symbol.for('DeleteDepartmentUseCase'),

	// Documents
	IDocumentRepository: Symbol.for('IDocumentRepository'),
	IDocumentActionRepository: Symbol.for('IDocumentActionRepository'),
	IndexDocumentsUseCase: Symbol.for('IndexDocumentsUseCase'),
	GetDocumentUseCase: Symbol.for('GetDocumentUseCase'),
	CreateDocumentUseCase: Symbol.for('CreateDocumentUseCase'),
	UpdateDocumentUseCase: Symbol.for('UpdateDocumentUseCase'),
	ConvertDocumentUseCase: Symbol.for('ConvertDocumentUseCase'),
	ConvertToPurchaseUseCase: Symbol.for('ConvertToPurchaseUseCase'),
	RecordPaymentUseCase: Symbol.for('RecordPaymentUseCase'),
	DuplicateDocumentUseCase: Symbol.for('DuplicateDocumentUseCase'),
	// Cash Register
	ICashRegisterRepository: Symbol.for('ICashRegisterRepository'),
	CurrentSessionUseCase: Symbol.for('CurrentSessionUseCase'),
	OpenSessionUseCase: Symbol.for('OpenSessionUseCase'),
	CloseSessionUseCase: Symbol.for('CloseSessionUseCase'),
	RecordMovementUseCase: Symbol.for('RecordMovementUseCase'),
	IndexCashRegistersUseCase: Symbol.for('IndexCashRegistersUseCase'),
};
