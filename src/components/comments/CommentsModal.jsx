import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import CommentIcon from '@mui/icons-material/Comment';
import CommentComponent from './CommentsComponent';
import { TrendingUpSharp } from '@mui/icons-material';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
    maxHeight: '30rem',
    overflowY: 'scroll',
    borderRadius: '15px'
};

export default function CommentsModal({ card }) {
    // console.log('CommentsModal RENDER');
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = useState({
        content: '',
        cardID: card?._id
    })
    const [count, setCount] = useState(0)
    useEffect(() => {
        const fetchCommentsCount = async () => {
            const res = await axios.get(`/comments/${card._id}/count`)
            setCount(res.data.count)
        }
        fetchCommentsCount();
    }, [card._id])
    // const handleOpen = () => setOpen(true)
    const handleOpen = async () => {
        setOpen(true)
        console.log(open)
        try {
            const res = await axios.get(`/comments/${card._id}`)
            console.log(res.data)
            setComments(res.data)
            setFormData({
                content: ''
            })
        }
        catch (err) {
            setMessage({
                text: err.response?.data?.message,
                severity: 'error'
            })
        }
    }

    const handleClose = () => setOpen(false);
    const [comments, setComments] = useState([])
    const { setMessage } = useNotification();



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/comments', formData, {
                withCredentials: true
            })
            console.log(res.data)
            setComments(prev => [...prev, res.data.comment])
            console.log('these are comments', comments)
            // setComments(res.card.comments)
        }
        catch (err) {
            setMessage({
                text: err.response?.data?.message,
                severity: 'error'
            })
        }
    }

    return (
        <div>
            <Button onClick={handleOpen}>{count}<CommentIcon /></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box
                        component="form"
                        sx={{ '& .MuiTextField-root': { m: 1, maxWidth: '100%' } }}
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'right', mb: 1, }}><CloseIcon onClick={handleClose} /></Box>
                        <TextField
                            id="filled-multiline-static"
                            label="Leave a comment"
                            multiline
                            rows={3}
                            sx={{ width: '100%' }}
                            value={formData.content}

                            name="content"
                            variant="filled"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <>
                                            {/* <InputAdornment position="end">
                                        <TextStyles />
                                    </InputAdornment> */}
                                            <InputAdornment position="end">
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    size="small"
                                                    sx={{ mt: 5 }}>
                                                    Submit
                                                </Button>
                                            </InputAdornment>
                                        </>
                                    ),
                                },
                            }}
                            onChange={handleChange}
                        />

                        {comments.map(comment => (
                            <CommentComponent comment={comment} key={comment._id} setComments={setComments} />
                            // console.log('these are the comments', comment)
                        )
                        )}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}