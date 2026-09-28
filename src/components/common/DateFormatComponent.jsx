import React from 'react'
import { Typography, Box } from '@mui/material';

const DateFormatComponent = ({ dueDate }) => {
    const getDueDateStatus = (getDateString) => {
        if (!getDateString) return null;
        const due = new Date(getDateString)
        const today = new Date();
        due.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const dueTime = due.getTime();
        const todayTime = today.getTime();

        const msPerDay = 1000 * 60 * 60 * 24;
        const diffDays = Math.round((dueTime - todayTime) / msPerDay);

        return {
            isOverDue: dueTime < todayTime,
            isToday: dueTime === todayTime,
            isUpcoming: dueTime > todayTime,
            diffDays
        }

    }
    if (!dueDate) return null;
    const date = new Date(dueDate)
    if (isNaN(date.getTime())) {
        return null;
    }
    const status = getDueDateStatus(dueDate)
    const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    let label = formattedDate;
    let color = 'secondary'

    if (status.isOverDue) {
        color = 'error.main'; // Red
        label = `Overdue by ${Math.abs(status.diffDays)}d (${formattedDate})`;
    } else if (status.isToday) {
        color = 'warning.main'; // Orange
        label = `Due today`;
    } else if (status.diffDays === 1) {
        label = `Due tomorrow`;
    }
    return (
        <Box sx={{ display: 'inline-flex', color: { color }, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color, fontWeight: 600 }}>
                {label}
            </Typography>
        </Box>
    )
}

export default DateFormatComponent