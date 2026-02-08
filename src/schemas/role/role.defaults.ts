import { CreateRoleFormType, UpdateRoleFormType } from "./role.schema";

export const defaultCreateRoleValues: CreateRoleFormType = {
    name: "",
    code: "",
    description: "",
    active: true,
};

export const defaultUpdateRoleValues = (role?: any): UpdateRoleFormType => ({
    id: role?.id || 0,
    name: role?.name || "",
    code: role?.code || "",
    description: role?.description || "",
    active: role?.active !== undefined ? role.active : true,
});
