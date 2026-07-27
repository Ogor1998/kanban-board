import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

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
    display: 'flex', justifyContent: 'center',
};

export default function NewColumnModal({ formData, handleChange, handleSubmit }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                        <Box
                            component="form"
                            sx={{ '& > :not(style)': { m: 1, width: '40ch', backgroundColor: '#fff', p: 1 } }}
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}

                        >
                            <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column', }}>
                                <Typography variant="h6" gutterBottom>

                                    Add a new Column
                                </Typography>
                                <TextField
                                    id="outlined-basic"
                                    label="Column-Title"
                                    variant="outlined"
                                    name='title'
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                                <Button type='submit'>Submit</Button>
                            </Box>
                        </Box >
                    </Box>
                </Fade>
            </Modal>
        </div >
    );
}
