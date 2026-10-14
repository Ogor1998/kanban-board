import { Box, Card, CardContent, Skeleton, Divider } from '@mui/material'

export default function ProfileSkeleton() {
    return (
        <Box sx={{ maxWidth: 900, margin: '40px auto', px: 4 }}>
            <Card sx={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.3)' }}>
                <CardContent>

                    {/* Avatar + name section */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mb: 5, p: 3 }}>
                        <Skeleton variant="circular" width={100} height={100} sx={{ marginRight: '2rem' }} />
                        <Box sx={{ marginRight: 'auto' }}>
                            <Skeleton variant="text" width={200} height={40} />
                            <Skeleton variant="text" width={150} height={35} sx={{ my: 1 }} />
                            <Skeleton variant="text" width={180} height={30} />
                        </Box>
                        <Skeleton variant="rounded" width={60} height={36} />
                    </Box>

                    <Divider />

                    {/* Stats section */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', my: 2, gap: '5rem', p: 3 }}>
                        {['Boards', 'Cards', 'Comments'].map(label => (
                            <Box key={label} className='profile__extras' sx={{ textAlign: 'center' }}>
                                <Skeleton variant="text" width={60} height={24} />
                                <Skeleton variant="text" width={40} height={24} />
                            </Box>
                        ))}
                    </Box>

                    <Divider />

                    {/* Tabs skeleton */}
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Skeleton variant="rounded" width={80} height={36} />
                            <Skeleton variant="rounded" width={80} height={36} />
                        </Box>
                        {/* Tab content skeleton - board cards */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {[1, 2, 3].map(i => (
                                <Box key={i} sx={{ p: 2, borderRadius: 2, border: '1px solid #eee', width: 180 }}>
                                    <Skeleton variant="text" width="80%" height={24} />
                                    <Skeleton variant="text" width="50%" height={20} />
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                        <Skeleton variant="circular" width={20} height={20} />
                                        <Skeleton variant="circular" width={20} height={20} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                </CardContent>
            </Card>
        </Box>
    )
}