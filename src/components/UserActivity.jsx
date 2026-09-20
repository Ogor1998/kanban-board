
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Box, Typography, Avatar, List, ListItem,
    ListItemAvatar, ListItemText, Divider, CircularProgress, Button
} from '@mui/material'
import { getActionColor } from '../utils/getActionColor'
import { formatDistanceToNow } from 'date-fns'


const UserActivity = ({ username }) => {

    const [activity, setActivity] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await axios.get(`/activity/${username}`)
                setActivity(res.data)
            }
            catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchActivity();
    }, [username])
    return (
        <>
            {
                loading ? (
                    <CircularProgress />
                ) : activity.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No activity yet
                    </Typography>
                ) :
                    (<List dense>
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
                    </List>)

            }
        </>
    )
}

export default UserActivity