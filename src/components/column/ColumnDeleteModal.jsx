import React, { useState } from 'react'
import { Modal, Box, Typography, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material'


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
            <Box>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        sx: { borderRadius: '14px', p: 1, bgcolor: '#ffffff' }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 600 }}>Delete this column?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            This will permanently remove <strong>'{col?.title}'</strong> all associated cards. This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ pb: 2, px: 3 }}>
                        <Button onClick={handleClose} color="inherit">
                            Cancel
                        </Button>
                        <Button onClick={() => handleDelete(col._id)} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

        </div >
    )
}

export default ColumnDeleteModal