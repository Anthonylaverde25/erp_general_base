# 📁 Estructura SCSS

Esta carpeta contiene la arquitectura SCSS modular del proyecto, organizada siguiendo las mejores prácticas de la arquitectura 7-1.

## 🗂️ Estructura de Carpetas

```
scss/
├── abstracts/      # Variables, mixins y funciones
├── base/           # Reset, tipografía y utilidades
├── components/     # Componentes compartidos
├── layout/         # Estructura de la aplicación
├── modules/        # Estilos por módulo (users, roles, auth, sales)
├── themes/         # Temas de la aplicación
└── main.scss       # Archivo principal de entrada
```

## 🚀 Uso

### 1. Importar en tu aplicación

Agrega la siguiente línea en tu archivo `src/index.tsx` o en tu componente principal:

```typescript
import '@/styles/scss/main.scss';
```

### 2. Agregar nuevos estilos de módulo

Cuando crees un nuevo módulo (ej: `products`), sigue estos pasos:

1. Crea una carpeta en `modules/`:
   ```bash
   mkdir src/styles/scss/modules/products
   ```

2. Crea archivos parciales (con `_` al inicio):
   ```bash
   touch src/styles/scss/modules/products/_product-list.scss
   touch src/styles/scss/modules/products/_product-form.scss
   ```

3. Importa los archivos en `main.scss`:
   ```scss
   // Products
   @import 'modules/products/product-list';
   @import 'modules/products/product-form';
   ```

### 3. Usar variables y mixins

En cualquier archivo SCSS puedes usar las variables y mixins definidos:

```scss
.mi-componente {
  color: $primary-color;
  padding: $spacing-md;
  @include flex-center;
  @include box-shadow('md');
}
```

## 📋 Variables Disponibles

### Colores
- `$primary-color`, `$secondary-color`
- `$success-color`, `$warning-color`, `$error-color`, `$info-color`
- `$gray-50` hasta `$gray-900`

### Espaciado
- `$spacing-xs` hasta `$spacing-3xl`

### Tipografía
- `$font-size-xs` hasta `$font-size-4xl`
- `$font-weight-light` hasta `$font-weight-bold`

### Breakpoints
- `$breakpoint-xs`, `$breakpoint-sm`, `$breakpoint-md`, `$breakpoint-lg`, `$breakpoint-xl`

## 🎨 Mixins Útiles

```scss
@include flex-center           // Centrar con flexbox
@include flex-between          // Espaciar con flexbox
@include respond-to('md')      // Media queries responsive
@include box-shadow('md')      // Agregar sombra
@include hover-lift            // Efecto hover de elevación
@include text-truncate         // Truncar texto
```

## 📝 Convenciones

- **Archivos parciales**: Usar `_` al inicio (ej: `_variables.scss`)
- **Nombres de clases**: Usar kebab-case (ej: `user-list-item`)
- **BEM**: Considera usar BEM para componentes complejos
- **Orden de importación**: Mantener el orden en `main.scss` (abstracts → base → layout → components → modules → themes)

## 🔧 Mantenimiento

- Mantén los archivos modulares y pequeños
- Documenta variables y mixins complejos
- Evita estilos inline, usa clases reutilizables
- Usa las variables en lugar de valores hardcodeados
