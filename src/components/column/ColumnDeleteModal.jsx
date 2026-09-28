import React, { useState } from 'react'
import { Modal, Box, Typography, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxWidth: '90vw',
    maxHeight: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
};

const ColumnDeleteModal = ({ col, handleDelete }) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <IconButton variant='outlined' color='error' onClick={handleOpen} ><DeleteIcon /></IconButton>
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
                        Do you really want to delete column? This process is irreversable
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '10px', m: 1, justifyContent: 'center' }}>
                        <Button variant='outlined' color='success' onClick={handleClose}>Cancel</Button>
                        <Button variant='outlined' color='error' onClick={() => handleDelete(col._id)}>Yes, Delete Column</Button>
                    </Box>
                </Box>
            </Modal>
        </div >
    )
}

export default ColumnDeleteModal