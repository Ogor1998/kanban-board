
import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import './Heading.css'
import { Typography } from '@mui/material';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { updateColumn } from '../api/columns'
import { useBoard } from '../context/BoardContext';




const Heading = ({ col, handleDelete, setColumns, boardId }) => {
    const { isLoggedIn, currentUser } = useAuth();
    const [isEditting, setIsEditting] = useState(false)
    const { singleBoard, findBoard } = useBoard();
    const [title, setTitle] = useState(col.title)
    const { setMessage } = useNotification();
    const handleClick = () => {
        setTitle(title);
        setIsEditting(prev => !prev)
    }

    // console.log('this is the column', col)

    React.useEffect(() => {
        if (!isLoggedIn) return
        findBoard(boardId)
    }, [boardId, isLoggedIn])

    const canDeleteCol = isLoggedIn && currentUser?._id.toString() === singleBoard?.owner?._id.toString();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await updateColumn(col._id, { title, boardId })
            const updatedColumn = res.data.column;
            console.log(res.data)
            setColumns((prev) => prev.map(column =>
                column._id === updatedColumn._id ? {
                    ...column,          // keep cards
                    ...updatedColumn,   // overwrite title, order, etc.
                } : column
            ))
            setMessage({ text: res.data.message, severity: 'success' })
            setIsEditting(false)
        } catch (err) {
            setMessage({ text: err.response?.data?.message || "Something went wrong", severity: 'error' })
            console.log('it failed because', err)
        }

    }
    return (

        <Box className='Heading'>
            {isEditting ?
                (<Box
                    component="form"
                    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px' }}
                    onSubmit={handleSubmit}
                >
                    <TextField id="outlined-basic"
                        label="Column-Title"
                        variant="outlined"
                        name='title'
                        size='small'
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                    <Button type='submit' variant='outlined'>Update</Button>
                    <Button variant='outlined' color='error' onClick={handleClick}>Cancel</Button>
                </Box>) :

                (<Box sx={{ display: 'flex', border: '0.4px solid #fff', width: '100%', padding: '0px 10px', borderRadius: '15px', alignItems: 'center' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.5rem', mx: 1 }}>
                        {col.title}
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.5rem', marginRight: 'auto' }}>
                        Cards  ({col.cards.length})
                    </Typography>
                    {canDeleteCol ? <>
                        <Button variant='outlined' color='success' onClick={handleClick}><CreateIcon /></Button>
                        <Button variant='outlined' color='error' onClick={() => handleDelete(col._id)}><DeleteIcon /></Button></>
                        : null}
                </Box>)
            }

        </Box>
    )
}

export default Heading