import { lazy } from "react";

const CategoriesTabView = lazy(
    () => import("../components/CategoriesTabView"),
);

export default function CategoriesPage() {
    return <CategoriesTabView />;
}
