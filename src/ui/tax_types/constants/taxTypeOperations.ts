export const TAX_TYPE_OPERATIONS = [
    { value: "add", label: "Sumar al total" },
    { value: "subtract", label: "Restar al total" },
] as const;

export type TaxTypeOperation = typeof TAX_TYPE_OPERATIONS[number]['value'];



