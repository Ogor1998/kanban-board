
import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import './Heading.css'
import { Typography } from '@mui/material';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';



const Heading = ({ col, handleDelete, setColumns }) => {
    const [isEditting, setIsEditting] = useState(false)
    const [title, setTitle] = useState(col.title)
    const { setMessage } = useNotification();
    const handleClick = () => {
        setTitle(title);
        setIsEditting(prev => !prev)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/columns/${col._id}`, { title, });
            const updatedColumn = res.data.column;
            setColumns((prev) => prev.map(column =>
                column._id === updatedColumn._id ? {
                    ...column,          // keep cards
                    ...updatedColumn,   // overwrite title, order, etc.
                } : column
            ))
            setIsEditting(false)
            setMessage(res.data.message)
            console.log('it worked')
        } catch (err) {
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
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                    <Button type='submit' variant='outlined'>Update</Button>
                    <Button type='submit' variant='outlined' color='error' onClick={handleClick}>Cancel</Button>
                </Box>) :

                (<Box sx={{ display: 'flex', border: '1px solid #000', width: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ marginRight: 'auto' }}>

                        {col.title}
                    </Typography>
                    <Button variant='outlined' color='error' onClick={() => handleDelete(col._id)}><DeleteIcon /></Button>
                    <Button variant='outlined' color='success' onClick={handleClick}><CreateIcon /></Button>
                </Box>)
            }

        </Box>
    )
}

export default Heading