import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { useNotification } from '../context/NotificationContext'

export default function AlertBox() {
    const [open, setOpen] = React.useState(true);
    const { message } = useNotification();
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
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {message.text}
                </Alert>
            </Collapse>
        </Box>
    );
}
