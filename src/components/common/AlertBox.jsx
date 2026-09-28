import * as React from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNotification } from '../../context/NotificationContext';
import { useLocation } from 'react-router-dom';

export default function AlertBox() {
    const { message, setMessage } = useNotification();
    const location = useLocation();

    const alertText = message?.text || location.state?.message;
    const severity = message?.severity || 'success';

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setMessage({ text: '', severity: '' });
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={Boolean(alertText)}
            autoHideDuration={5000}
            onClose={handleClose}
            sx={{ mt: 7 }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{ width: '100%', minWidth: '300px', maxWidth: '500px', boxShadow: 3 }}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            >
                {alertText}
            </Alert>
        </Snackbar>
    );
}