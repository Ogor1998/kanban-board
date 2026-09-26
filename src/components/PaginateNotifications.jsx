import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { List, ListItem, ListItemAvatar, ListItemText, Typography, Box, Avatar } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { MarkAsUnread } from '@mui/icons-material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

const PaginateNotifications = ({ username }) => {
    const [notification, setNotification] = useState([])
    useEffect(() => {
        const fetchNoti = async () => {
            const res = await axios.get(`/notifications/user/${username}`);
            console.log('this is the notification object', res.data)
            setNotification(res.data)
        }
        fetchNoti();
    }, [username])
    return (
        <>

            <List dense>
                {notification.map((item, index) => {
                    const unread = item.isRead;
                    return (
                        <ListItem key={item._id} alignItems="flex-start" sx={{ px: 1, backgroundColor: '#fff', color: '#000', borderRadius: '10px', border: '1px solid #000', alignItems: 'center' }}>
                            <ListItemAvatar>
                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }} src={item.user?.image}>
                                    {item.user?.firstname?.charAt(0).toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="body2">
                                        <strong>{item.sender?.firstname}</strong> {item.action}{' '}
                                        {item.message && (
                                            <Box component="span" sx={{ color: "#000" }}>
                                                {item.message}
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
                            {unread ? <MarkAsUnread /> : <MarkEmailReadIcon />}
                            {index < notification.length - 1 && <Divider />}
                        </ListItem>
                    )

                })}
            </List>
        </>
    )
}

export default PaginateNotifications