export const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '';
    
    // Extract only the date part if it's an ISO string or has a timestamp
    const baseDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.split(' ')[0];
    
    // Handle YYYY-MM-DD format
    const parts = baseDate.split('-');
    if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
    }
    // Fallback or handle ISO string
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return dateStr;
    }
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

export const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    if (!arr) return [[]];
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );
};
