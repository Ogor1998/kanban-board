import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Modal,
    Box,
    Button,
    Typography,
    TextField
} from '@mui/material';
import { Share, Close } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Autocomplete } from '@mui/material';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { Delete } from '@mui/icons-material';

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

const CardInviteComponent = ({ closeInviteModal, openInvite, openInviteModal, card, setColumns }) => {
    const [selectedUser, setSelectedUser] = useState(null)
    const { setMessage } = useNotification();
    const [value, setValue] = useState("")
    const [formData, setFormData] = useState({})
    const [users, setUsers] = useState([]);
    const [isShare, setIshare] = useState(false)
    const { currentUser } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const handleShowShare = (user) => {
        setSelectedUser(user)
        setFormData(prev => ({
            ...prev, firstname: user.firstname
        }))
        setIshare(true)
    }
    const closeShowShare = () => {
        setIshare(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/cards/${card._id}/invite`, {
                memberID: selectedUser._id,
            })
            const updatedCard = res.data.card;
            console.log("Check if members are objects here:", updatedCard.members);


            setColumns(prev => {
                return prev.map(column => ({
                    ...column,
                    cards: column.cards.map(c => c._id === updatedCard._id ? updatedCard : c)
                }))
            })

            console.log('this is the message', res.data.message)
            setMessage({
                text: res.data.message,
                severity: 'success'
            })
            closeInviteModal();
            console.log(res.data)
        } catch (err) {
            setMessage({
                text: err.response?.data?.message,
                severity: 'error'
            })
        }
    }

    const removeMember = async (cardId, memberID) => {
        const res = await axios.delete(`/cards/${cardId}/member/${memberID}`);
        const updatedCard = res.data.card;
        setColumns(prev => {
            return prev.map(column => ({
                ...column, cards: column.cards.map(c => c._id === updatedCard._id ? updatedCard : c)
            }))
        })
        setMessage({
            text: res.data.message,
            severity: 'error'
        })

    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/users');
                setUsers(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, []);

    const isAlreadyMember = card.members.some(m => m._id === selectedUser?._id)

    return (
        <div>
            <Box>
                <Button onClick={openInviteModal}><PersonAddIcon /></Button>
            </Box>
            <Modal
                open={openInvite}
                onClose={closeInviteModal}
            >
                <Box sx={style}>

                    {!isShare ? (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}
                            >
                                <Typography variant="h5">
                                    Invite a new member
                                </Typography>

                                <Button
                                    onClick={closeInviteModal}
                                    sx={{ minWidth: 'auto' }}
                                >
                                    <Close />
                                </Button>
                            </Box>

                            {users.map(user => (
                                <Box
                                    key={user._id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        // border: '1px solid #000',
                                        borderRadius: 2,
                                        backgroundColor: '#00000082',
                                        color: '#fff',
                                        p: 1,
                                        mb: 1
                                    }}
                                >
                                    <Typography>
                                        {user.firstname}
                                    </Typography>

                                    <Button variant="contained" onClick={() => handleShowShare(user)}>
                                        <Share sx={{ mr: 1 }} />
                                        Invite
                                    </Button>
                                </Box>
                            ))}
                        </>
                    )

                        : (
                            <>
                                <Box sx={{ display: 'flex', alignItems: 'center', m: 1, justifyContent: 'center', position: 'relative' }}>
                                    <Typography sx={{ textAlign: 'center', m: 1, fontSize: '2.5rem' }}>
                                        Add this user to card
                                    </Typography>
                                    <Button onClick={closeShowShare} sx={{ position: 'absolute', top: 0, right: 0 }}>
                                        <Close />
                                    </Button>
                                </Box>

                                <Box
                                    component='form'
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        fontSize: '2.5rem',
                                        gap: '5px',
                                        justifyContent: 'center'
                                    }}
                                    onSubmit={handleSubmit}>

                                    <TextField id="outlined-basic"
                                        label="Username"
                                        variant="outlined"
                                        name='username'
                                        onChange={handleChange}
                                        value={formData.firstname || ''}

                                    />
                                    {isAlreadyMember ? <Button variant='contained' onClick={() => removeMember(card._id, selectedUser._id)}>Remove User<Delete /></Button> :
                                        <Button type='submit' variant='contained'><PersonAddIcon /> Add User</Button>

                                    }


                                </Box>
                            </>
                        )
                    }


                </Box>


            </Modal>
        </div>
    );
};

export default CardInviteComponent;