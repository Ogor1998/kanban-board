import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

const Fade = React.forwardRef(function Fade(props, ref) {

    const {
        children,
        in: open,
        onClick,
        onEnter,
        onExited,
        ownerState,
        ...other
    } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter(null, true);
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited(null, true);
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {React.cloneElement(children, { onClick })}
        </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element.isRequired,
    in: PropTypes.bool,
    onClick: PropTypes.any,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
    ownerState: PropTypes.any,
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
};

export default function NewBoardModal({ setData, formData, setFormData }) {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const location = useLocation();
    const handleOpen = () => {
        if (!isLoggedIn) {

            navigate("/login", {
                state: {
                    from: location,
                    message: "Please log in to create a board",
                },
            });
        } else {
            setOpen(true)
        }
    };
    const handleClose = () => setOpen(false);
    const { setMessage } = useNotification();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/boards', formData);
            console.log(res.data)
            setData(prev => [...prev, formData])
            setMessage({ text: res.data.message, severity: 'success' })
            navigate('/boards')

        } catch (err) {
            console.log(err)
            setMessage({ text: err.response?.data?.message, severity: 'error' })
        }

    }

    return (
        <div>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>


                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        zIndex: 1000
                    }}
                    onClick={handleOpen}
                >
                    <AddIcon />
                </Fab>

            </Box>

            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: { slots: { transition: Fade } },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography variant="h6" gutterBottom>

                            Add a new Board
                        </Typography>
                        <Box
                            component="form"
                            sx={{ '& > :not(style)': { m: 1, display: 'flex', flexDirection: 'column' } }}
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                        >
                            <Box>

                                <TextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    name='title'
                                    value={formData.title}
                                    onChange={handleChange}
                                    label="Board Name"
                                    sx={{
                                        width: "25rem",

                                        "& .MuiOutlinedInput-root": {
                                            fontSize: "1.6rem",
                                            paddingY: "0.8rem",
                                        },

                                        "& .MuiInputLabel-root": {
                                            fontSize: "1.6rem",
                                        },
                                    }}
                                />


                                <Button type='submit' sx={{ fontSize: '1.5rem', m: 1 }} variant='outlined'>Submit</Button>
                            </Box>
                        </Box >
                    </Box>
                </Fade>
            </Modal>
        </div >
    );
}


