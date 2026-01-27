
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

import ProfileCompany from '../tabs/ProfileCompany';
import BillingAddressTab from '../tabs/BillingAddressTab';
import PreferencesTab from '../tabs/PreferencesTab';
import DangerZoneTab from '../tabs/DangerZoneTab';

export default function SettingPage() {
    const [tab, setTab] = React.useState(0);

    // Company profile state
    const [companyName, setCompanyName] = React.useState<string>("ACME Corporation");
    const [companyUrl, setCompanyUrl] = React.useState<string>("https://acme.example");
    const [logoFile, setLogoFile] = React.useState<File | null>(null);
    const [faviconFile, setFaviconFile] = React.useState<File | null>(null);
    const [designType, setDesignType] = React.useState<string>("standard");

    const handleUpdateCompany = () => {
        // TODO: conectar con API para guardar variables
        console.log("update company", { companyName, companyUrl, logoFile, faviconFile, designType });
    };

    return (
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
                    onClick={handleUpdateCompany}
                >
                    Guardar Configuración
                </Button>
            </Box>

            <Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {/* Main content per tab */}
                    {tab === 0 && (
                        <ProfileCompany
                            companyName={companyName}
                            setCompanyName={setCompanyName}
                            companyUrl={companyUrl}
                            setCompanyUrl={setCompanyUrl}
                            logoFile={logoFile}
                            setLogoFile={setLogoFile}
                            faviconFile={faviconFile}
                            setFaviconFile={setFaviconFile}
                            designType={designType}
                            setDesignType={setDesignType}
                        />
                    )}

                    {tab === 1 && <BillingAddressTab />}

                    {tab === 2 && <PreferencesTab />}

                    {tab === 3 && <DangerZoneTab />}
                </Box>
            </Box>
        </Box>
    );
}
