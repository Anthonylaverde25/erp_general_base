# Solución de Propagación de Estado de Autenticación "En Caliente"

## 📄 Contexto del Problema
Al cambiar la "Empresa Activa" en la aplicación, el backend actualizaba el registro correctamente, pero la Interfaz de Usuario (UI) **no reflejaba el cambio inmediatamente**. El usuario tenía que recargar la página (F5) para ver la nueva empresa activa.

Esto ocurría porque el componente núcleo `FuseAuthProvider` tenía una limitación en su lógica de actualización de estado: **ignoraba las actualizaciones si el usuario ya estaba autenticado**.

## 🛠️ Solución Implementada

Se modificó `src/@fuse/core/FuseAuthProvider/FuseAuthProvider.tsx` para permitir actualizaciones de estado en usuarios autenticados, siempre y cuando los datos hayan cambiado realmente.

### 1. Habilitación de Actualizaciones "En Caliente" (Scenario 4)
Se añadió un nuevo bloque condicional ("Scenario 4") en el `useEffect` principal del `FuseAuthProvider`.

**Antes:**
Si `isAuthenticated` era `true`, el provider retornaba `prev` (el estado anterior), descartando los nuevos datos.

**Ahora:**
Si `isAuthenticated` es `true`, verificamos si los nuevos datos del usuario (`providerAuthState.user`) son diferentes a los actuales.

### 2. Prevención de Bucles Infinitos (`lodash.isEqual`)
Para evitar que React entre en un bucle infinito de re-renderizados (porque `{...objeto}` crea una nueva referencia en memoria aunque los datos sean iguales), implementamos una **comparación profunda** usando `lodash`.

```typescript
import _ from 'lodash';

// ... dentro del useEffect ...

// Scenario 4: Update state if already authenticated and provider matches
if (prev.isAuthenticated && providerAuthState.isAuthenticated && prev.provider === name) {
    // Solo actualiza si los datos REALMENTE cambiaron (comparación profunda)
    if (!_.isEqual(prev.user, providerAuthState.user)) {
        return { ...providerAuthState, provider: name };
    }
}
```

## 🔄 Flujo de Datos Final

1.  **Acción**: Usuario cambia de empresa con `useChangeCompany`.
2.  **API**: Se llama a `ShowCompanyUseCase` para traer los datos frescos.
3.  **Local Update**: Se llama a `updateUser({ ... }, { onlyLocal: true })` en `JwtAuthProvider`.
4.  **Propagación**:
    *   `JwtAuthProvider` actualiza su estado interno.
    *   `FuseAuthProvider` detecta el cambio.
    *   **CRÍTICO**: El nuevo "Scenario 4" valida con `_.isEqual`. Si cambió (ej. nuevo ID de empresa), acepta el nuevo estado.
5.  **React Query**: `useChangeCompany` invalida la query `['activeCompany']`.
6.  **UI**: `useActiveCompany` recibe el nuevo ID del contexto y React Query refresca los datos visuales instantáneamente.
