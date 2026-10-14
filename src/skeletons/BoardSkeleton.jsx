import { Skeleton, Box } from "@mui/material"

export default function BoardSkeleton() {
    return (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4].map(i => (
                <Box key={i} sx={{ width: 200, p: 2, borderRadius: 2, bgcolor: '#fff' }}>
                    <Skeleton variant="rounded" width="100%" height={80} />
                    <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="40%" />
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="circular" width={24} height={24} />
                    </Box>
                </Box>
            ))}
        </Box>
    )
}