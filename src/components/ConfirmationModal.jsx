import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
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
    const [board, setBoard] = React.useState([])
    const openInviteModal = () => setInviteOpen(true);
    const closeInviteModal = () => setInviteOpen(false);
    const { deleteBoard } = useBoard();

    React.useEffect(() => {
        const fetchboards = async () => {
            const res = await axios.get(`/boards/${boardId}`)
            console.log('this is the board object', res.data)
            setBoard(res.data)
        }
        fetchboards();
    }, [boardId])

    const visitProfile = (username) => {
        return navigate(`/profile/${username}`)
    }

    console.log('this is board members', board)

    return (
        <div>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', p: 1 }}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginRight: 'auto' }} className='heading__board'>
                    {board?.title}
                </Typography>


                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginRight: '5px' }}>
                    Members {board?.members?.length}
                </Typography>
                {board?.members?.map(member => (
                    <Box key={member._id}>
                        <Stack direction="row" spacing={3}>
                            <Avatar alt={member.user.username} src={member.user.image} className={`${member.role}`}
                                onClick={() => visitProfile(member.user?.username)} />
                        </Stack>
                    </Box>
                ))}
                <Button onClick={openInviteModal}><Share /></Button>
                <Button color='primary'><Create /></Button>
                <Button onClick={handleOpen}><Delete /></Button>
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
        </div>
    );
}