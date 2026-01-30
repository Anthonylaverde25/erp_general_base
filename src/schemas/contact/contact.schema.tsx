
import { z } from "zod";
import { Contact } from "@/types/company.types";

export const contactSchema = z.object({
    email: z.string().email("Email inválido"),
    phone: z.string().optional(),
    default: z.boolean().default(false),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const defaultUpdateContactValues = (contact?: Contact | null): ContactFormData => ({
    email: contact?.email || "",
    phone: contact?.phone || "",
    default: contact?.default || false,
});
