import { UnitTypeEntity } from "@/domain/entities/unit_types/UnitTypeEntity";
import { UnitTypeFormType } from "./unit_types.schema";

export const defaultCreateUnitTypeValues: UnitTypeFormType = {
    name: "",
    description: "",
    is_active: true,
};

export const defaultUpdateUnitTypeValues = (
    data: UnitTypeEntity
): UnitTypeFormType => ({
    name: data.name,
    description: data.description || "",
    is_active: data.is_active,
});
