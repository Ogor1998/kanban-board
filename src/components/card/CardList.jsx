import * as React from 'react';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useBoard } from '../../context/BoardContext'
import CardDeleteModal from './CardDeleteModal';
import { Create, Delete } from '@mui/icons-material';




const ITEM_HEIGHT = 48;

export default function CardList({ handleCardDelete, handleSwitch, card }) {
    const [openCardDelete, setOpenCardDelete] = useState(false)
    const handleCardDeleteOpen = () => setOpenCardDelete(true);
    const handleCardDeleteClose = () => setOpenCardDelete(false);

    const { currentUser } = useAuth()
    const { singleBoard } = useBoard();
    const options = [
        { label: 'Edit', action: handleSwitch, icon: <Create /> },
        { label: 'Delete', action: handleCardDeleteOpen, icon: <Delete /> }

    ];
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const IsCardOwner = currentUser?._id === singleBoard?.owner?._id
    // console.log('this is the board owner ', singleBoard)
    // console.log('this is the board currentUser ', currentUser?._id)

    return (
        <div>
            {IsCardOwner ? (
                <>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>

                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            paper: {
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '25ch',
                                    display: 'flex',
                                },
                            },
                            list: {
                                'aria-labelledby': 'long-button',
                            },
                        }}
                    >
                        {options.map((option) => (
                            <MenuItem
                                key={option.label}
                                onClick={handleClose}
                            >
                                <Button onClick={option.action}>
                                    <IconButton sx={{ marginRight: 'auto' }}>{option.icon} </IconButton> {option.label}
                                </Button>
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            ) : null}


            <CardDeleteModal
                handleCardDeleteClose={handleCardDeleteClose}
                openCardDelete={openCardDelete}
                card={card}
            />
        </div>
    );
}
