import FusePageCarded from "@fuse/core/FusePageCarded";
import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import ItemsHeader from "../components/ItemsHeader";
import ItemsTabView from "../components/ItemsTabView";

const Root = styled(FusePageCarded)(() => ({
    "& .container": {
        maxWidth: "100%!important",
    },
}));

export default function ItemsPage() {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState('all');

    const handleCreate = () => {
        if (currentTab === 'physical' || currentTab === 'service') {
            navigate(`/items/create?type=${currentTab}`);
        } else {
            navigate('/items/create');
        }
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    return (
        <Root
            header={<ItemsHeader onCreate={handleCreate} currentTab={currentTab} />}
            content={<ItemsTabView currentTab={currentTab} onTabChange={handleTabChange} />}
        />
    );
}
