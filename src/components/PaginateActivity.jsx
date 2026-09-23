import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Box,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    CircularProgress,
    Button
} from '@mui/material'
import { getActionColor } from '../utils/getActionColor'
import { formatDistanceToNow } from 'date-fns'



const PaginateActivity = ({ itemsPerPage, username }) => {
    // A state variable to track the current page number.
    const [page, setPage] = useState(1)

    // A state variable to store the list of fetched items.
    const [items, setItems] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        setItems([]);
        setPage(1);
        setHasMore(true);
        setInitialLoading(true)
    }, [username]);
    useEffect(() => {
        if (!username) return;

        let isMounted = true;

        const fetchActivity = async () => {
            try {
                const res = await axios.get(`/activity/user/${username}`, {
                    params: { page, limit: itemsPerPage }
                })
                const { activities, pagination } = res.data
                console.log('Activity Payload Item:', activities?.[0]);

                setItems(prev => (page === 1 ? activities : [...prev, ...activities]))
                setHasMore(pagination.hasMore);
            }
            catch (err) {
                console.error('Error fetching activities:', err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setInitialLoading(false);
                }
            }
        }
        fetchActivity();
        return () => {
            isMounted = false;
        };
    }, [username, page, itemsPerPage])

    const handleLoadMore = () => {
        setPage(prev => prev + 1)
    }
    if (initialLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={30} />
            </Box>
        );
    }

    return (
        <div style={{ overflowY: 'auto' }}>
            <List dense>
                {items.map((item, index) => (
                    <Box key={item._id}>
                        <ListItem alignItems="flex-start" sx={{ px: 1, backgroundColor: getActionColor(item.action), color: '#000', borderRadius: '10px', }}>
                            <ListItemAvatar>
                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }} src={item.user?.image}>
                                    {item.user?.firstname?.charAt(0).toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="body2">
                                        <strong>{item.user?.firstname}</strong> {item.action}{' '}
                                        {item.target && (
                                            <Box component="span" sx={{ color: "#000" }}>
                                                "{item.target}"
                                            </Box>
                                        )}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                    </Typography>
                                }
                            />
                        </ListItem>
                        {index < items.length - 1 && <Divider />}
                    </Box>
                ))}
            </List>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            )}

            {hasMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleLoadMore}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Load More'}
                    </Button>
                </Box>
            )}
        </div>
    )
}

export default PaginateActivity