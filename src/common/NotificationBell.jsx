import React, { useState } from 'react';
import {
    IconButton,
    Badge,
    Popover,
    Box,
    Tabs,
    Tab,
    Fade
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaginateActivity from '../components/PaginateActivity';
import PaginateNotifications from '../components/PaginateNotifications';

export default function NotificationBell({ username, unreadCount = 0 }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleTabChange = (event, newIndex) => setTabIndex(newIndex);

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
                            <PaginateNotifications username={username} />
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