import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Modal,
    Box,
    Button,
    Typography,
    TextField
} from '@mui/material';
import { Share, Close } from '@mui/icons-material';
import { Autocomplete } from '@mui/material';

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


const permissions = ['admin', 'member', 'public']

const InviteComponent = ({ closeInviteModal, openInvite }) => {
    const [value, setValue] = useState("")
    const [formData, setFormData] = useState({
        firstname: ''
    })
    const [users, setUsers] = useState([]);
    const [isShare, setIshare] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const handleShowShare = (user) => {
        setFormData(prev => ({
            ...prev, firstname: user.firstname
        }))
        setIshare(true)
    }
    const closeShowShare = () => {
        setIshare(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
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

    return (
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
                                    border: '1px solid #000',
                                    borderRadius: 2,
                                    p: 1,
                                    mb: 1
                                }}
                            >
                                <Typography>
                                    {user.firstname}
                                </Typography>

                                <Button variant="outlined" onClick={() => handleShowShare(user)}>
                                    <Share sx={{ mr: 1 }} />
                                    Invite
                                </Button>
                            </Box>
                        ))}
                    </>
                )

                    : (
                        <>
                            <Button onClick={closeShowShare}><Close /></Button>
                            <Typography sx={{ textAlign: 'center', m: 1 }}>
                                Invite this user
                            </Typography>
                            <Box
                                component='form'
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    fontSize: '2.5rem'
                                }}
                                onSubmit={handleSubmit}>

                                <TextField id="outlined-basic"
                                    label="Username"
                                    variant="outlined"
                                    name='username'
                                    onChange={handleChange}
                                    value={formData.firstname || ''}

                                />


                                <Autocomplete
                                    disablePortal
                                    options={permissions}
                                    sx={{ width: 170 }}
                                    renderInput={(params) => <TextField {...params} label="Permissions" />}
                                    onChange={(event, newValue) => {
                                        setValue(newValue)
                                        setFormData(prev => ({
                                            ...prev,
                                            permissions: newValue,
                                        }));
                                    }}
                                    value={value.toUpperCase()}
                                />

                                <Button type='submit' variant='outlined'>Invite User</Button>

                            </Box>
                        </>
                    )
                }


            </Box>


        </Modal>
    );
};

export default InviteComponent;