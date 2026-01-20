import { Box, LinearProgress, Typography } from "@mui/material";



interface LoadingProgressProps {
    message: string;
}

export default function LoadingProgress({ message }: LoadingProgressProps) {
    return (
        <div >
            <Typography>{message}</Typography>
            <LinearProgress />

        </div>
    );
}