import {
    Box,
    Skeleton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider
} from '@mui/material'

export default function ActivitySkeleton({ count = 5 }) {
    return (
        <List dense>
            {Array.from({ length: count }).map((_, index) => (
                <Box key={index}>
                    <ListItem
                        alignItems="flex-start"
                        sx={{
                            px: 1,
                            borderRadius: '10px',
                            mb: 0.5
                        }}
                    >
                        <ListItemAvatar>
                            <Skeleton variant="circular" width={32} height={32} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Skeleton variant="text" width={80} height={20} />
                                    <Skeleton variant="text" width={120} height={20} />
                                    <Skeleton variant="text" width={90} height={20} />
                                </Box>
                            }
                            secondary={
                                <Skeleton variant="text" width={80} height={16} />
                            }
                        />
                    </ListItem>
                    {index < count - 1 && <Divider />}
                </Box>
            ))}
        </List>
    )
}