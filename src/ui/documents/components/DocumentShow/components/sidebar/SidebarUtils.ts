import { format } from "date-fns";

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
};

export const formatEuropeanDate = (dateString: string | null | undefined) => {
    if (!dateString) return "---";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return format(date, "dd/MM/yyyy");
    } catch (e) {
        return dateString;
    }
};
