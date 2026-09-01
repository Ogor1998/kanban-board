import { useState } from "react"
import { Box, Button, Autocomplete, Typography, TextField } from "@mui/material"
import FileUpload from '../reuseable/FileUpload';

export default function EditCard({ card, columnId, handleSwitch }) {
    const [formData, setFormData] = useState({
        title: card.title,
        priority: card.priority,
        description: card.description,
        columnId
    })

    const priority = ['low', 'medium', 'high']
    const [value, setValue] = useState(card.priority)
    const [file, setFile] = useState([])
    const [previews, setPreviews] = useState(card.images)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append("title", formData.title)
        form.append("description", formData.description)
        form.append("priority", formData.priority)
        form.append("columnId", columnId)

        file.forEach((image) => {
            form.append('images', image)
        })
        const res = await axios.put(`/cards/${card._id}`, form)
        const updateCard = res.data.card;
        setColumns((prev) => prev.map(column => ({
            ...column, cards: column.cards.map(card => card._id === updateCard._id ? updateCard : card)
        })
        ))
        console.log(formData)
        console.log(res.data)

    }

    const handleDelete = (idx) => {
        console.log('getting clicked')
        setPreviews(prev =>
            prev.filter((_, index) => index !== idx))
    }




    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#fff', p: 1,
            borderRadius: '15px'
        }}

            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <Typography variant="h6" sx={{ fontWeight: 300, fontSize: '1.5rem' }} gutterBottom>
                Update Card
            </Typography>
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
            <Box sx={{ display: "flex", gap: 2, overflowX: 'scroll', width: '250px' }}>
                {previews.map((src, index) => (
                    <div key={index}>
                        <label htmlFor={index}></label>
                        <img
                            src={src}
                            alt={`preview-${index}`}
                            width="100"
                            height='100'
                        />
                        <Delete onClick={() => handleDelete(index)} />
                    </div>
                ))}
            </Box>
            <FileUpload setFile={setFile} setPreviews={setPreviews} />
            <Button type='submit'>Submit</Button>
            <Button color='error' onClick={handleSwitch}>Cancel</Button>
        </Box>
    )
}