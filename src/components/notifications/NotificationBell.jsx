import React, { useEffect, useState } from 'react';
import {
    IconButton,
    Badge,
    Popover,
    Box,
    Tabs,
    Tab,
    Fade, Avatar, Typography,
    CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaginateActivity from '../activity/PaginateActivity';
import PaginateNotifications from './PaginateNotifications';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';
import toast from 'react-hot-toast'



export default function NotificationBell({ itemsPerPage = 5, username }) {
    const [page, setPage] = useState(1)
    const [anchorEl, setAnchorEl] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [notification, setNotification] = useState([])
    const unreadCount = notification?.filter(n => !n.isRead).length
    const { socket } = useSocket();

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleTabChange = (event, newIndex) => setTabIndex(newIndex);

    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true);


    useEffect(() => {
        setNotification([]);
        setPage(1);
        setHasMore(true);
        setInitialLoading(true)
    }, [username]);

    useEffect(() => {
        if (!username) return
        let isMounted = true;
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`/notifications/user/${username}`, {
                    params: { page, limit: itemsPerPage }
                })
                const { notification, pagination } = res.data
                setNotification(prev => (page === 1 ? notification : [...prev, ...notification]))
                setHasMore(pagination.hasMore)

            } catch (err) {
                console.log(err)
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setInitialLoading(false);
                }
            }
        }
        fetchNotifications()
        return () => {
            isMounted = false;
        }
    }, [username, page, itemsPerPage])
    const handleLoadMore = () => {
        setPage(prev => prev + 1)
    }

    useEffect(() => {
        if (!socket) return

        socket.on('notification', (newNotification) => {
            console.log("Socket notification received:", newNotification)
            console.log("isRead value:", newNotification.isRead)
            setNotification(prev => [newNotification, ...prev])

            // ← show toast
            toast.custom((t) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: 'white',
                        p: 1.5,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        opacity: t.visible ? 1 : 0,
                        transition: 'opacity 0.3s'
                    }}
                >
                    <Avatar src={newNotification.sender?.image} sx={{ width: 32, height: 32 }}>
                        {newNotification.sender?.firstname?.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight="bold">
                            {newNotification.sender?.firstname}
                        </Typography>
                        <Typography variant="caption">
                            {newNotification.message}
                        </Typography>
                    </Box>
                </Box>
            ), { duration: 4000 })
        })

        return () => socket.off('notification')
    }, [socket])
    const open = Boolean(anchorEl);



    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                TransitionComponent={Fade}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 380,
                            height: 480,
                            borderRadius: 2,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column'
                        }
                    }
                }}
            >
                {/* Tab Header */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
                    <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
                        <Tab
                            label={
                                <Badge color="error" badgeContent={unreadCount} sx={{ pr: 1 }}>
                                    Notifications
                                </Badge>
                            }
                        />
                        <Tab label="Activity" />
                    </Tabs>
                </Box>

                {/* Tab Panels */}
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                    {open && tabIndex === 0 && (

                        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            <PaginateNotifications
                                notification={notification}
                                setNotification={setNotification}
                                hasMore={hasMore}
                                loading={loading}
                                handleLoadMore={handleLoadMore}
                                initialLoading={initialLoading}
                            />
                        </Box>
                    )}

                    {open && tabIndex === 1 && username && (
                        <PaginateActivity username={username} itemsPerPage={5} />
                    )}
                </Box>
            </Popover>
        </>
    );
}


