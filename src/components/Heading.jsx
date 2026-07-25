
import React from 'react'
import { Box, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import './Heading.css'
import { Typography } from '@mui/material';


const Heading = ({ col, handleDelete }) => {
    return (

        <Box className='Heading'>
            <Typography variant="h6" gutterBottom>
                {col.title}
            </Typography>
            <Button variant='outlined' color='error' onClick={() => handleDelete(col._id)}><DeleteIcon /></Button>
            <Button variant='outlined' color='success'><CreateIcon /></Button>
        </Box>
    )
}

export default Heading