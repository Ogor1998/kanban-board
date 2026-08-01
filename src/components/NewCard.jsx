import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { useNotification } from '../context/NotificationContext';

export default function NewCard({ setColumns, columnId, setisActiveColumn }) {
    const { setMessage } = useNotification();
    const priority = ['low', 'medium', 'high']
    const [formData, setFormData] = useState({
        title: "",
        priority: "",
        description: "",
        columnId
    })
    const [value, setValue] = useState("")
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/cards`, formData)
            const newCard = res.data.card
            setColumns(prev =>
                prev.map(column =>
                    column._id === columnId ?
                        {
                            ...column,
                            cards: [...column.cards, newCard],
                        }
                        : column
                ))
            setisActiveColumn(null)
        } catch (err) {
            setMessage({ text: err.response?.data?.message, severity: 'error' })
        }
    }
    return (
        <Box
            component="form"
            // sx={{ '& .MuiTextField-root': { m: 1, width: '30ch' } }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}

        >
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px', backgroundColor: '#fff', p: 1, borderRadius: '15px' }}>

                <TextField
                    id="outlined-multiline-flexible"
                    label="Title"
                    multiline
                    maxRows={4}
                    name='title'
                    onChange={handleChange}
                    value={formData.title}
                />


                <Autocomplete
                    disablePortal
                    options={priority}
                    sx={{ width: 170 }}
                    renderInput={(params) => <TextField {...params} label="Priority" />}
                    onChange={(event, newValue) => {
                        setValue(newValue)
                        setFormData(prev => ({
                            ...prev,
                            priority: newValue,
                        }));
                    }}
                    value={value.toUpperCase()}
                />


                <TextField
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    rows={4}
                    defaultValue="Description"
                    name='description'
                    onChange={handleChange}
                    value={formData.description}
                />
                <Button type='submit'>Submit</Button>
            </Box>



        </Box>
    );
}
