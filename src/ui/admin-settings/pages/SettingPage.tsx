

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
import BillingAddressTab from '../tabs/BillingAddressTab';
import PreferencesTab from '../tabs/PreferencesTab';
import DangerZoneTab from '../tabs/DangerZoneTab';
import useActiveCompany from "@/features/companies/useActiveCompany";

const companySettingsSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    website: z.string().url("URL inválida").optional().or(z.literal("")),
    logo: z.custom<File>((v) => v instanceof File).nullable().optional(),
    favicon: z.custom<File>((v) => v instanceof File).nullable().optional(),
    design_type: z.string().default("standard"),
    billing_address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        country: z.string().optional(),
    }).optional(),
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
            billing_address: {
                street: "",
                city: "",
                state: "",
                zip: "",
                country: "",
            },
            preferences: {
                language: "Español",
                number_format: "1,234.56",
            }
        },
    });

    const { reset, handleSubmit, formState: { isSubmitting } } = methods;

    useEffect(() => {
        if (activeCompany) {
            reset({
                name: activeCompany.name || "",
                website: activeCompany.website || "",
                design_type: "standard", // Assuming default as it's not in Company type yet
                logo: null, // Files can't be set from URL directly without fetching, usually kept null or handled differently
                favicon: null,
                billing_address: {
                    street: activeCompany.addresses?.[0]?.street || "",
                    city: activeCompany.addresses?.[0]?.city || "",
                    state: activeCompany.addresses?.[0]?.state || "",
                    zip: activeCompany.addresses?.[0]?.postal_code || "",
                    country: activeCompany.addresses?.[0]?.country || "",
                },
                preferences: {
                    language: "Español",
                    number_format: "1,234.56",
                }
            });
        }
    }, [activeCompany, reset]);

    const onSubmit = (data: CompanySettingsForm) => {
        console.log("Form data valid. Preparing submission...", data);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("website", data.website || "");
        formData.append("design_type", data.design_type);

        // Handle files
        if (data.logo) {
            formData.append("logo", data.logo);
        }
        if (data.favicon) {
            formData.append("favicon", data.favicon);
        }

        // Handle nested objects (depending on backend expectation, usually flattened or JSON stringified)
        // Here we assume backend expects keys like 'billing_address[street]' or similar, 
        // OR we can just send the JSON if the backend accepts JSON body. 
        // For file uploads, we must use FormData. 
        // Common pattern for Laravel/modern backends with FormData:
        Object.keys(data.billing_address).forEach(key => {
            const k = key as keyof typeof data.billing_address;
            formData.append(`billing_address[${k}]`, data.billing_address[k] || "");
        });

        Object.keys(data.preferences).forEach(key => {
            const k = key as keyof typeof data.preferences;
            formData.append(`preferences[${k}]`, data.preferences[k] || "");
        });

        // Debug output
        console.log(" FormData entries:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // TODO: Call API endpoint
        // updateCompanyMutation.mutate(formData);
    };

    return (
        <FormProvider {...methods}>
            <Box className='' sx={{ width: "100%" }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
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
                            icon={<FuseSvgIcon>heroicons:arrows-pointing-in</FuseSvgIcon>}
                            label="Dirección de Facturación"
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

                    <Button
                        className="btn-primary"
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<FuseSvgIcon size={16}>heroicons-outline:check</FuseSvgIcon>}
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        Guardar Configuración
                    </Button>
                </Box>

                <Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {/* Main content per tab */}
                        {tab === 0 && <ProfileCompany />}
                        {tab === 1 && <BillingAddressTab />}
                        {tab === 2 && <PreferencesTab />}
                        {tab === 3 && <DangerZoneTab />}
                    </Box>
                </Box>
            </Box>
        </FormProvider>
    );
}
