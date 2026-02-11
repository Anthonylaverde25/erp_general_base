import FusePageCarded from "@fuse/core/FusePageCarded";
import { lazy } from "react";
import styled from "styled-components";

const PartnersTabView = lazy(
    () => import("../components/PartnersTabView"),
);


const Root = styled(FusePageCarded)(() => ({
    "& .container": {
        maxWidth: "100%!important",
    },
}));


import PartnersHeader from "../components/PartnersHeader";
import { useState } from "react";
import { CreatePartnerModal } from "@/app/(control-panel)/partners/CreatePartnerModal";

export default function PartnersPage() {
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const handleCreate = () => {
        setOpenCreateModal(true);
    };

    return (
        <>
            <Root header={<PartnersHeader onCreate={handleCreate} />} content={<PartnersTabView />} />
            <CreatePartnerModal open={openCreateModal} handleClose={() => setOpenCreateModal(false)} />
        </>
    );
}

