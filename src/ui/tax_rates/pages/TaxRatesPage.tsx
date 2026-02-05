
import axiosInstance from "@/lib/@axios";
import { lazy, useEffect } from "react";
import { useTranslation } from "react-i18next";

const TaxRatesTabView = lazy(
    () => import("../components/TaxRatesTabView"),
);

export default function TaxRatesPage() {
    useEffect(() => {
        const fetch = async () => {
            const { data: { tax_rates } } = await axiosInstance.get('/tax-rates')
            console.log('tax rates', tax_rates)
        }
        fetch();
    }, [])
    const { t } = useTranslation("settings");

    return <TaxRatesTabView />;
}
