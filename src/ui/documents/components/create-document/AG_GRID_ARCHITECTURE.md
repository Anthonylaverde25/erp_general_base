# Plan de Componentización de DocumentCreateLinesTable

El archivo actual `DocumentCreateLinesTable.tsx` tiene más de 550 líneas y mezcla la configuración de la tabla, lógica de sincronización con React Hook Form, Custom Cell Editors interactivos (el Autocomplete) y Custom Cell Renderers (Chips, Delete).

Para escalarlo profesionalmente, propongo la siguiente arquitectura limpia dividiendo responsabilidades:

## Nueva Estructura de Directorios

```text
src/ui/documents/components/create-document/
├── table-ag-grid/                     # Nueva carpeta para contener toda la lógica de AG Grid
│   ├── DocumentCreateLinesTable.tsx   # (Punto de entrada) Solo monta la grilla y conecta los hooks
│   ├── useDocumentTableSync.ts        # (Hook) Maneja el estado local 'rows', el drag&drop y la sincronización con React Hook Form
│   ├── columns.tsx                    # (Configuración) Definición pura de columnDefs usando useMemo
│   ├── utils.ts                       # (Helpers) makeEmptyLine, collectRows, etc.
│   │
│   ├── cell-editors/
│   │   └── ItemAutocompleteCellEditor.tsx # (Componente) Toda la lógica compleja del buscador flotante (Portal, Teclas, etc.)
│   │
│   └── cell-renderers/
│       ├── TaxChipsCellRenderer.tsx       # (Componente) Visualización y borrado de impuestos
│       └── DeleteCellRenderer.tsx         # (Componente) Botón de borrar fila
│
├── table-mui/                         # La versión alternativa con Material UI (ya la tenemos)
│   └── DocumentCreateLinesTableMui.tsx
```

## Responsabilidad de cada archivo

### 1. `table-ag-grid/DocumentCreateLinesTable.tsx`
Quedará muy delgado (menos de 100 líneas). Su única responsabilidad será:
- Usar el hook `useDocumentTableSync` para obtener `rows` y `setRows`.
- Obtener `columnDefs` del archivo de configuración.
- Renderizar el `<AgGridReact>` pasándole los props y módulos.

### 2. `table-ag-grid/useDocumentTableSync.ts`
Extraeremos aquí toda la lógica de:
- Inicialización de filas (dos filas en blanco por defecto).
- Escucha de eventos custom (`doc-line-update`, `doc-line-delete`).
- Sincronización inmutable con `useFormContext().setValue('lines', ...)` de React Hook Form.
- Handlers de `onRowDragEnd` y `onCellValueChanged`.

### 3. `table-ag-grid/columns.tsx`
Un hook o función pura que devuelve los `columnDefs`. Recibirá por parámetros si `discountEnabled` está activo para empujar dinámicamente esa columna. Esto limpia el archivo principal de definiciones visuales.

### 4. `table-ag-grid/cell-editors/ItemAutocompleteCellEditor.tsx`
Este es el archivo más denso actualmente (~180 líneas). Lo aislamos completamente. Es un editor de AG Grid autónomo que sabe buscar (`useSearchItems`), mostrar el dropdown vía React Portal y disparar el evento de actualización.

### 5. Renderizados de Celda (Renderers)
Pequeños componentes React puros que solo reciben la data de la celda y muestran UI (Los chips de impuestos de Material UI y el icono del basurero).

---

Con esto, pasaremos de un componente monolítico y difícil de mantener a una estructura modular **plug-and-play**, donde editar el buscador de items no implica tocar el código de la tabla, y la configuración de columnas está separada de la lógica de sincronización del formulario.

¿Te parece bien que proceda a crear esta estructura capa por capa?
