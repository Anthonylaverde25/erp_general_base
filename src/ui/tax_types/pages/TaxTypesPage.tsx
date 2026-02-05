import axiosInstance from "@/lib/@axios";
import { lazy, useEffect } from "react";

const TaxTypesTabView = lazy(
    () => import("../components/TaxTypesTabView"),
);

export default function TaxTypesPage() {
    useEffect(() => {
        const fetch = async () => {
            const { data: { tax_types
            } } = await axiosInstance.get("/tax-types");
            console.log('tipos de impuestos', tax_types);
        }
        fetch();
    }, [])
    return <TaxTypesTabView />;
}
