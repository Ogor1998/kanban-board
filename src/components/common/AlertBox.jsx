import * as React from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNotification } from '../../context/NotificationContext';
import { useLocation } from 'react-router-dom';
export default function AlertBox() {
    const { message, setMessage } = useNotification();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setMessage({ text: '', severity: '' });
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={Boolean(message?.text)}
            autoHideDuration={5000}
            onClose={handleClose}
            sx={{ mt: 7 }}
        >
            <Alert
                onClose={handleClose}
                severity={message?.severity || 'info'}
                variant="filled"
                sx={{ width: '100%', minWidth: 300, boxShadow: 3 }}
            >
                {message?.text}
            </Alert>
        </Snackbar>
    );
}