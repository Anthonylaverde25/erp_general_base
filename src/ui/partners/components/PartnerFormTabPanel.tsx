import { Box } from '@mui/material';
import React from 'react';

interface PartnerFormTabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export default function PartnerFormTabPanel(props: PartnerFormTabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`partner-tabpanel-${index}`}
            aria-labelledby={`partner-tab-${index}`}
            {...other}
            className="h-full overflow-y-auto p-6"
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}
