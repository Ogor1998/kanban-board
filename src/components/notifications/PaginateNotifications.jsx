import React from 'react';
import axios from 'axios';
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Box,
    Avatar,
    IconButton,
    CircularProgress,
    Button,
    Tooltip
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useNavigate } from 'react-router-dom';
import './PaginateNotifications.css';
import NotificationSkeleton from '../../skeletons/NotificationSkeleton';

const PaginateNotifications = ({
    notification = [],
    setNotification,
    handleLoadMore,
    loading,
    hasMore,
    initialLoading
}) => {
    const navigate = useNavigate();

    const handleItemClick = (link, notificationId, isRead) => {
        if (!isRead) {
            openNotification(notificationId, isRead);
        }
        if (link) {
            navigate(link);
        }
    };

    const openNotification = async (notificationId, currentStatus) => {
        try {
            await axios.put(`/notifications/${notificationId}`);
            setNotification((prev) =>
                prev.map((n) =>
                    n._id === notificationId ? { ...n, isRead: !currentStatus } : n
                )
            );
        } catch (err) {
            console.error('Failed to update notification status:', err);
        }
    };

    if (initialLoading) {
        return <NotificationSkeleton />;
    }

    // if (!notification || notification.length === 0) {
    //     return (
    //         <Box sx={{ p: 4, textAlign: 'center' }}>
    //             <Typography variant="body1" color="text.secondary">
    //                 You have no notifications yet
    //             </Typography>
    //         </Box>
    //     );
    // }

    return (
        <Box sx={{ width: '100%' }}>
            <List dense disablePadding>
                {notification.map((item) => {
                    const unread = !item.isRead;

                    return (
                        <React.Fragment key={item._id}>
                            <ListItem
                                alignItems="center"
                                className="notification__item"
                                onClick={() => handleItemClick(item.link, item._id, item.isRead)}
                                sx={{
                                    px: 1.5,
                                    py: 1,
                                    mb: 0.75,
                                    backgroundColor: unread ? 'rgba(25, 118, 210, 0.08)' : '#fff',
                                    borderRadius: '8px',
                                    border: '1px solid',
                                    borderColor: unread ? 'rgba(25, 118, 210, 0.2)' : '#e0e0e0',
                                    cursor: item.link ? 'pointer' : 'default',
                                    transition: 'all 0.15s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: unread ? 'rgba(25, 118, 210, 0.14)' : '#f5f5f5',
                                    },
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{ width: 34, height: 34, fontSize: '0.85rem' }}
                                        src={item.sender?.image}
                                    >
                                        {item.sender?.firstname?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                    primary={
                                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                            <strong>{item.sender?.firstname || 'Someone'}</strong>{' '}
                                            {item.action}{' '}
                                            {item.message && (
                                                <Box component="span" sx={{ fontWeight: 500 }}>
                                                    "{item.message}"
                                                </Box>
                                            )}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="text.secondary">
                                            {item.createdAt
                                                ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })
                                                : ''}
                                        </Typography>
                                    }
                                />

                                <Tooltip title={unread ? 'Mark as read' : 'Mark as unread'}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents triggering list item navigation
                                            openNotification(item._id, item.isRead);
                                        }}
                                        sx={{ ml: 1 }}
                                    >
                                        {unread ? (
                                            <MarkEmailReadIcon fontSize="small" sx={{ color: '#1976d2' }} />
                                        ) : (
                                            <MarkAsUnreadIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                                        )}
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                        </React.Fragment>
                    );
                })}
            </List>

            {hasMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleLoadMore}
                        disabled={loading}
                        sx={{ textTransform: 'none', minWidth: 100 }}
                    >
                        {loading ? <CircularProgress size={18} color="inherit" /> : 'Load More'}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default PaginateNotifications;