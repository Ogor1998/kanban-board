import { useEffect, useState } from 'react'

import {
    Modal, Box, Typography, Avatar, List, ListItem,
    ListItemAvatar, ListItemText, Divider, CircularProgress, Button, IconButton
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'
import { getActionColor } from '../../utils/getActionColor'
import HistoryIcon from '@mui/icons-material/History';
import { getActivity } from '../../api/activities'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxWidth: '90vw',
    maxHeight: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
}

export default function ActivityModal({ itemsPerPage = 5, boardId, open, setOpenActivity, onClose }) {
    // const [activity, setActivity] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)

    // A state variable to store the list of fetched items.
    const [items, setItems] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        setItems([]);
        setPage(1);
        setHasMore(true);
        setInitialLoading(true)
    }, [boardId]);

    useEffect(() => {
        if (!open) return  // ← only fetch when modal opens
        const fetchActivity = async () => {
            setLoading(true)
            try {
                const res = await getActivity(boardId, {
                    params: { page, limit: itemsPerPage }
                })
                const { activities, pagination } = res.data
                console.log('Activity Payload Item:', activities?.[0]);

                setItems(prev => (page === 1 ? activities : [...prev, ...activities]))
                setHasMore(pagination.hasMore);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchActivity()
    }, [boardId, open, page])

    const handleLoadMore = () => {
        setPage(prev => prev + 1)
    }

    return (


        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Activity</Typography>
                    <Button onClick={onClose} sx={{ minWidth: 'auto' }}>
                        <Close />
                    </Button>
                </Box>

                {loading ? (
                    <CircularProgress />
                ) : items.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No activity yet
                    </Typography>
                ) : (

                    <Box sx={{ maxHeight: '35rem' }}>

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


                        {hasMore && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, mb: 2 }}>
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


                    </Box>
                )}
            </Box>
        </Modal>
    )
}