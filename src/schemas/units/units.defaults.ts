import { UnitEntity } from "@/domain/entities/units/UnitEntity";
import { UnitFormType } from "./units.schema";

export const defaultCreateUnitValues: UnitFormType = {
    unit_type_id: 0,
    code: "",
    name: "",
};

export const defaultUpdateUnitValues = (data: UnitEntity): UnitFormType => ({
    unit_type_id: data.unit_type_id,
    code: data.code,
    name: data.name,
});
