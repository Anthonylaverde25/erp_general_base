import FusePageCarded from "@fuse/core/FusePageCarded";
import { useState } from "react";
import styled from "styled-components";
import ItemsHeader from "../components/ItemsHeader";
import ItemsTabView from "../components/ItemsTabView";

const Root = styled(FusePageCarded)(() => ({
    "& .container": {
        maxWidth: "100%!important",
    },
}));

export default function ItemsPage() {
    const [currentTab, setCurrentTab] = useState('all');

    const handleCreate = () => {
        console.log("Create Item");
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    return (
        <Root
            header={<ItemsHeader onCreate={handleCreate} />}
            content={<ItemsTabView currentTab={currentTab} onTabChange={handleTabChange} />}
        />
    );
}
