import { ActiveCompany } from "@/types/company.types";
import useAuth from "@fuse/core/FuseAuthProvider/useAuth";


export default function useActiveCompany() {
    const { authState: { user: { active_company } = {} } = {} } = useAuth()
    const activeCompany = active_company as ActiveCompany
    return { ...activeCompany }
}