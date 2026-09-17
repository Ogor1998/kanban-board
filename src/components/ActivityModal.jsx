import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Modal, Box, Typography, Avatar, List, ListItem,
    ListItemAvatar, ListItemText, Divider, CircularProgress, Button
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'
import { getActionColor } from '../utils/getActionColor'

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

export default function ActivityModal({ boardId, open, setOpenActivity, onClose }) {
    const [activity, setActivity] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!open) return  // ← only fetch when modal opens
        const fetchActivity = async () => {
            try {
                const res = await axios.get(`/activity/${boardId}`)
                console.log('this is the activity', res.data)
                setActivity(res.data)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchActivity()
    }, [boardId, open])



    return (
        <div>
            <Button onClick={() => setOpenActivity(true)}>Activity</Button>

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
                    ) : activity.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No activity yet
                        </Typography>
                    ) : (
                        <List dense>
                            {activity.map((item, index) => (
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
                                    {index < activity.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>
                    )}
                </Box>
            </Modal>

        </div>
    )
}