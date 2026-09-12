import * as React from 'react';
import { TextField, Button, Box, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Create, Delete } from '@mui/icons-material';
import { useNotification } from '../context/NotificationContext';
import InviteComponent from './InviteComponent';
import { Share } from '@mui/icons-material';
import { Stack, Avatar } from '@mui/material';
import '../pages/Show.css'
import './ConfirmationModal.css'
import { useBoard } from '../context/BoardContext';
import { findBoard } from '../api/boards';
import { useAuth } from '../context/AuthContext';


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

export default function ConfirmationModal({ boardId }) {
    const [open, setOpen] = React.useState(false);
    const [openInvite, setInviteOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();
    const [board, setBoard] = React.useState({})
    const openInviteModal = () => setInviteOpen(true);
    const closeInviteModal = () => setInviteOpen(false);
    const { deleteBoard } = useBoard();
    const { currentUser, isLoggedIn } = useAuth();
    const [isEditting, setIsEditting] = React.useState(false)
    const { setMessage } = useNotification();


    React.useEffect(() => {
        const fetchboards = async () => {
            const res = await findBoard(boardId)
            // console.log('this is the board object', res.data)
            setBoard(res.data)
        }
        fetchboards();
    }, [boardId])

    const [title, setTitle] = React.useState({
        title: ''
    })
    console.log('this is board title', board.title)
    const handleEdit = () => {
        setTitle(board.title || '');
        setIsEditting(prev => !prev)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/boards/${boardId}`, { title })
            console.log('this is data upon submission', res.data)
            setBoard(prev => ({ ...prev, title: res.data.board.title || title }))
            console.log('this is the title object', title)

            setIsEditting(false)
            setMessage({ text: res.data.message, severity: 'success' })
            // console.log('this is title info', res.data)
        } catch (err) {
            setMessage({
                text: err.response?.data?.message,
                severity: 'error'
            })
        }

    }
    const visitProfile = (username) => {
        return navigate(`/profile/${username}`)
    }

    const isBoardOwner = isLoggedIn && currentUser?._id === board.owner?._id;
    const isAdmin = board?.members?.some(
        m => m.user?._id === currentUser?._id && m.role === 'admin'
    )

    const canEditOrDelete = isAdmin || isBoardOwner;
    console.log('this is board owner', isBoardOwner)

    return (
        <div>
            <Box sx={{ display: 'flex', flexDirection: 'row', minWidth: '0', alignItems: 'center', p: 1 }}>
                {isEditting ? (
                    <Box
                        component="form"
                        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px', marginRight: 'auto' }}
                        onSubmit={handleSubmit}
                    >
                        <TextField id="outlined-basic"
                            label="Board-Title"
                            variant="outlined"
                            name='title'
                            fullWidth
                            size='small'
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                        <Button type='submit' variant='outlined' sx={{ px: 2 }}>Update</Button>
                        <Button variant='outlined' color='error' onClick={handleEdit}>Cancel</Button>
                    </Box>
                ) : (

                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ marginRight: 'auto' }}
                        className='heading__board'
                    >
                        {board.title}
                    </Typography>
                )}

                <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ marginRight: '5px' }}
                    className='members'
                >
                    Members {board?.members?.length}
                </Typography>
                {board?.members?.map(member => (
                    <Box key={member._id}>
                        <Stack direction="row" spacing={3}>
                            <Avatar alt={member.user.username || 'Member'} src={member.user.image} className={`${member.role}`}
                                onClick={() => visitProfile(member.user?.username && member.user?.username)} />
                        </Stack>
                    </Box>
                ))}
                {isBoardOwner && <Button onClick={openInviteModal}><Share /></Button>}
                {canEditOrDelete &&

                    <>
                        <Button color='primary' onClick={handleEdit}><Create /></Button>
                        <Button onClick={handleOpen}><Delete /></Button></>
                }
            </Box>
            <InviteComponent closeInviteModal={closeInviteModal} openInvite={openInvite} boardId={boardId} />
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
                        <Button variant='outlined' color='error' onClick={() => deleteBoard(boardId)}>Yes, Delete Board</Button>
                    </Box>
                </Box>
            </Modal>
        </div >
    );
}