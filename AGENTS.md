# Project Agents

## Architecture Conventions (Domain Writes)

For create/update flows in domain models:

- Keep `Entity` focused on domain state and business rules.
- If write payload contains transport-specific fields (e.g. `File`, partial updates, snake_case API fields), keep them in a `*WriteData` shape.
- Convert `*WriteData` to API DTOs only in infrastructure mappers (not inside repositories).
- Repositories should receive domain objects (and write data when needed), while API mapping stays in `src/infrastructure/mappers`.

### Create Pattern (Current Item Convention)

Use this pattern for models like `Item`:

1. In `Entity.create(inputDto)`:
- Build a domain-oriented write shape (e.g. `createData: CreateItemWriteData`) from input.
- Return the domain entity instance (e.g. `new ItemEntity(...)`) and keep `createData` attached for persistence flow.

2. In `CreateXUseCase`:
- Call `XEntity.create(data)` and pass the returned entity to repository.

3. In `RepositoryCrud`:
- Read entity write data via `entity.toCreateData()`.
- Convert write data to API DTO through `*WriteMapper`.
- Persist with HTTP client.

Important:
- The use case and repository contract operate with `Entity`.
- DTO flattening stays in write data + infrastructure mapper.


### Design criteria for UI components

- For the buttons in our development, we will use the buttons  provided by Material UI.
- For the required tabs, we will use the Shadcn tabs.
