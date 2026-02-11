import { Box } from "@mui/material";
import { useIndexPartners } from "@/features/partners/hooks/useIndexPartners";
import { PartnerEntity } from "@/domain/entities/partners/PartnerEntity";
import PartnerTable from "./PartnerTable";

export default function PartnersTabView() {
    // const { data: partners, isLoading } = useIndexPartners();
    // Mocking data for now as API might not be ready or to avoid errors if backend is missing
    const { data: partners, isLoading } = useIndexPartners();
    console.log('partners is', partners);

    // handleCreate moved to Page/Header


    const handleEdit = (partner: PartnerEntity) => {
        console.log("Edit partner", partner);
    };

    return (
        <Box className="flex flex-col w-full h-full overflow-hidden">

            {/* Header Section Removed */}


            {/* Table Section */}
            <PartnerTable
                partners={partners}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={(id) => console.log("Delete partner", id)}
            />
        </Box>
    );
}
