

import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import ProfileCompany from '../tabs/ProfileCompany';
import LocationContactTab from '../tabs/LocationContactTab';
import PreferencesTab from '../tabs/PreferencesTab';
import DangerZoneTab from '../tabs/DangerZoneTab';
import useActiveCompany from "@/features/companies/useActiveCompany";

const addressSchema = z.object({
    id: z.number().optional(),
    street: z.string().min(1, "La calle es requerida"),
    city: z.string().min(1, "La ciudad es requerida"),
    state: z.string().min(1, "La provincia es requerida"),
    postal_code: z.string().min(1, "El código postal es requerido"),
    country: z.string().min(1, "El país es requerido"),
    default: z.boolean().default(false),
});

const contactSchema = z.object({
    id: z.number().optional(),
    email: z.string().email("Email inválido"),
    phone: z.string().optional(),
});

const companySettingsSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    website: z.string().url("URL inválida").optional().or(z.literal("")),
    logo: z.custom<File>((v) => v instanceof File).nullable().optional(),
    favicon: z.custom<File>((v) => v instanceof File).nullable().optional(),
    design_type: z.string().default("standard"),
    addresses: z.array(addressSchema).default([]),
    contacts: z.array(contactSchema).default([]),
    preferences: z.object({
        language: z.string().optional(),
        number_format: z.string().optional(),
    }).optional(),
});

export type CompanySettingsForm = z.infer<typeof companySettingsSchema>;

export default function SettingPage() {
    const activeCompany = useActiveCompany();
    const [tab, setTab] = React.useState(0);

    const methods = useForm<CompanySettingsForm>({
        resolver: zodResolver(companySettingsSchema),
        defaultValues: {
            name: "",
            website: "",
            design_type: "standard",
            logo: null,
            favicon: null,
            addresses: [],
            contacts: [],
            preferences: {
                language: "Español",
                number_format: "1,234.56",
            }
        },
    });

    const { reset } = methods;

    useEffect(() => {
        if (activeCompany?.id) {
            reset({
                name: activeCompany.name || "",
                website: activeCompany.website || "",
                design_type: "standard",
                logo: null,
                favicon: null,
                addresses: activeCompany.addresses?.map(addr => ({
                    id: addr.id,
                    street: addr.street || "",
                    city: addr.city || "",
                    state: addr.state || "",
                    postal_code: addr.postal_code || "",
                    country: addr.country || "",
                    default: addr.default || false,
                })) || [],
                contacts: activeCompany.contacts?.map(contact => ({
                    id: contact.id,
                    email: contact.email || "",
                    phone: contact.phone || "",
                })) || [],
                preferences: {
                    language: "Español",
                    number_format: "1,234.56",
                }
            });
        }
    }, [activeCompany?.id, activeCompany, reset]);

    return (
        <FormProvider {...methods}>
            <Box className='' sx={{ width: "100%" }}>
                <Box
                    sx={{
                        mb: 3,
                        pb: 2.5,
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        className="bg-white"
                    >
                        <Tab
                            icon={<FuseSvgIcon>lucide:domain</FuseSvgIcon>}
                            label="Perfil de Empresa"
                        />
                        <Tab
                            icon={<FuseSvgIcon>heroicons:map-pin</FuseSvgIcon>}
                            label="Ubicación y Contacto"
                        />
                        <Tab
                            icon={<FuseSvgIcon>lucide:tune</FuseSvgIcon>}
                            label="Preferencias"
                        />
                        <Tab
                            icon={<FuseSvgIcon>lucide:alert-triangle</FuseSvgIcon>}
                            label="Danger"
                        />
                    </Tabs>
                </Box>

                <Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {/* Main content per tab */}
                        {tab === 0 && <ProfileCompany />}
                        {tab === 1 && <LocationContactTab />}
                        {tab === 2 && <PreferencesTab />}
                        {tab === 3 && <DangerZoneTab />}
                    </Box>
                </Box>
            </Box>
        </FormProvider>
    );
}
