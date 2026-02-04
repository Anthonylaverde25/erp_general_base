import { z } from "zod";

// Schema para dirección
const addressSchema = z.object({
    street: z.string().min(1, "La calle es requerida"),
    street_2: z.string().optional().nullable(),
    city: z.string().min(1, "La ciudad es requerida"),
    state: z.string().min(1, "El estado/provincia es requerido"),
    postal_code: z.string().min(1, "El código postal es requerido"),
    country: z.string().min(1, "El país es requerido"),
    default: z.boolean().optional().default(false),
});

const emptyStringToUndefined = (val: unknown) => {
    if (typeof val === "object" && val !== null) {
        const { street, city, state, postal_code, country } = val as any;
        // Check if main fields are empty
        if (!street && !city && !state && !postal_code && !country) {
            return undefined;
        }
    }
    return val;
};

const baseStoreSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    code: z.string().optional(),
    is_active: z.boolean().optional().default(true),
    address: z.preprocess(emptyStringToUndefined, addressSchema.optional()),
});

export const createStoreSchema = baseStoreSchema;

export const updateStoreSchema = baseStoreSchema.partial();

export type CreateStoreFormType = z.infer<typeof createStoreSchema>;
export type UpdateStoreFormType = z.infer<typeof updateStoreSchema>;

export const defaultCreateStoreValues: CreateStoreFormType = {
    name: "",
    code: "",
    is_active: true,
    address: {
        street: "",
        street_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        default: false,
    },
};

export const defaultUpdateStoreValues = (data?: any): UpdateStoreFormType => ({
    name: data?.name || "",
    code: data?.code || "",
    is_active: data?.is_active ?? true,
    address: data?.address ? {
        street: data.address.street,
        street_2: data.address.street_2,
        city: data.address.city,
        state: data.address.state,
        postal_code: data.address.postal_code,
        country: data.address.country,
        default: data.address.default ?? false,
    } : {
        street: "",
        street_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        default: false,
    }
});
