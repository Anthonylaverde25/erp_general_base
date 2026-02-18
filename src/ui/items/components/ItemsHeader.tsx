import { Button, Typography, Box, Stack, useTheme } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import PageBreadcrumb from "@/components/PageBreadcrumb";

interface ItemsHeaderProps {
    onCreate?: () => void;
}

function ItemsHeader(props: ItemsHeaderProps) {
    const { onCreate } = props;
    const theme = useTheme();

    return (
        <Box className='container' sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <PageBreadcrumb className="mb-4" />
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
            >
                <Box>
                    <Typography variant="h2" className="text-3xl font-bold tracking-tight">
                        Items
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Manage your inventory items
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={
                        <FuseSvgIcon size={20}>
                            heroicons-outline:plus
                        </FuseSvgIcon>
                    }
                    onClick={onCreate}
                >
                    Create Item
                </Button>
            </Stack>
        </Box>
    );
}

export default ItemsHeader;
