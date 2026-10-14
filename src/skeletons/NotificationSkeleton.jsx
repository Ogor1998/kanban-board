import { Skeleton, Box } from "@mui/material"
export default function NotificationSkeleton() {
    return (
        <>
            {[1, 2, 3].map(i => (
                <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="40%" />
                    </Box>
                </Box>
            ))}
        </>
    )
}