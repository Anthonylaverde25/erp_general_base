import { Role } from "@/types/role.types";

export interface UserListDTO {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: Role | null;
    role_ids?: number[];
    status: string;
}