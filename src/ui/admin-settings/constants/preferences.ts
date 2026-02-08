export const SUPPORTED_LANGUAGES = [
    { value: "Español", label: "Español" },
    { value: "Inglés", label: "Inglés" },
] as const;

export const NUMBER_FORMATS = [
    { value: "1,234.56", label: "1,234.56" },
    { value: "1.234,56", label: "1.234,56" },
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['value'];
export type NumberFormat = typeof NUMBER_FORMATS[number]['value'];
