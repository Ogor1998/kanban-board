import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    textAlign: 'center'
};

export default function ConfirmationModal({ handleDelete }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Do you really want to delete board? This process is irreversable
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '10px', m: 1, justifyContent: 'center' }}>
                        <Button variant='outlined' color='success' onClick={handleClose}>Cancel</Button>
                        <Button variant='outlined' color='error' onClick={handleDelete}>Yes, Delete Board</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}