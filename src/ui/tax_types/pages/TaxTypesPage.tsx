import axiosInstance from "@/lib/@axios";
import { lazy, useEffect } from "react";

const TaxTypesTabView = lazy(
    () => import("../components/TaxTypesTabView"),
);

export default function TaxTypesPage() {

    return <TaxTypesTabView />;
}
