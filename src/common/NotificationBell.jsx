import React, { useState } from 'react';
import {
    IconButton,
    Badge,
    Popover,
    Box,
    Typography,
    Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaginateActivity from '../components/PaginateActivity';

export default function NotificationBell({ username, unreadCount = 0 }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!username) return;
    const open = Boolean(anchorEl);
    console.log('notification ball username', username)
    return (
        <>
            {/* 1. Navbar Bell Icon with Counter */}
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            {/* 2. Dropdown Popover */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 360,
                            height: 480,
                            p: 1.5,
                            borderRadius: 2,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column'
                        }
                    }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                        Activity
                    </Typography>
                </Box>
                <Divider sx={{ mb: 1 }} />

                {/* 3. Reusable Paginated Activity Feed */}
                <Box sx={{
                    overflowY: 'auto', maxHeight: 380, p: 2,
                }}>
                    <PaginateActivity username={username} itemsPerPage={5} />
                </Box>
            </Popover>
        </>
    );
}