import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Box,
    Avatar,
    IconButton,
    Divider,
    CircularProgress,
    Button
} from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { MarkAsUnread } from '@mui/icons-material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useNavigate } from 'react-router-dom';
import './PaginateNotifications.css'

const PaginateNotifications = ({
    notification,
    setNotification,
    handleLoadMore,
    loading,
    hasMore,
    initialLoading }) => {

    const navigate = useNavigate();


    const directLink = (link) => {
        navigate(link)
    }
    const openNotification = async (notificationId, currentStatus) => {
        try {
            await axios.put(`/notifications/${notificationId}`)
            setNotification(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: !currentStatus } : n))
            console.log('notification opened')
        } catch (err) {
            console.log('it failed because', err)
        }
    }


    if (initialLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={30} />
            </Box>
        );
    }

    if (notification?.length === 0) {
        return (
            <Typography sx={{ fontSize: '2rem' }}>
                You have no notifications yet
            </Typography>
        )
    }
    return (
        <div>
            <List dense>
                {notification?.map((item, index) => {
                    const unread = !item.isRead;
                    console.log('this is unread', unread)
                    return (
                        <React.Fragment key={item._id}>

                            <ListItem
                                alignItems="flex-start"
                                className='notification__item'
                                sx={{
                                    px: 1,
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    borderRadius: '10px',
                                    alignItems: 'center',
                                    marginBottom: '0.2rem'
                                }}>
                                <ListItemAvatar>
                                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }} src={item.sender?.image}>
                                        {item.sender?.firstname?.charAt(0).toUpperCase()}
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
                                {unread ?
                                    <IconButton onClick={() => openNotification(item._id, item.isRead)}><MarkEmailReadIcon sx={{ color: '#1976d2' }} /></IconButton>

                                    :
                                    <IconButton onClick={() => openNotification(item._id, item.isRead)} ><MarkAsUnread color='green' /></IconButton>
                                }
                            </ListItem>
                            {index < notification.length - 1 && <Divider />}
                        </React.Fragment>
                    )

                })}
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

export default PaginateNotifications