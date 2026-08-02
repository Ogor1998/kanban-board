import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { useNotification } from '../context/NotificationContext'
import { useLocation } from 'react-router-dom';

export default function AlertBox() {
    const [open, setOpen] = React.useState(true);
    const { message, setMessage } = useNotification();
    const location = useLocation();

    React.useEffect(() => {
        if (!message.text) return;
        const timer = setTimeout(() => {
            setOpen(false)
            setMessage({
                text: "",
                severity: ""
            })
        }, 5000)
        return () => clearTimeout(timer)
    }, [message, setMessage])
    if (!message.text) return null
    return (
        <Box sx={{ width: '100%' }}>
            <Collapse in={open}>
                <Alert
                    severity={message.severity || "success"}
                    action={
                        <IconButton
                            aria-label="close"
                            color={message.severity}
                            size="small"
                            onClick={() => {
                                setOpen(false);
                                setMessage({ text: "", severity: "success" });
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {message.text || location.state?.message}
                </Alert>
            </Collapse>
        </Box>
    );
}
