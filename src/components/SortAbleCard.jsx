import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, Button } from '@mui/material'
import '../pages/Show.css'
import { Typography } from '@mui/material'
import CardList from './CardList'
import DragIndicator from '@mui/icons-material/DragIndicator'
import axios from 'axios'
import { useState } from 'react'
import { TextField, Autocomplete } from '@mui/material'
import { useParams } from 'react-router-dom'


export default function SortableCard({ card, setColumns, columnId }) {
    const priority = ['low', 'medium', 'high']
    const [value, setValue] = useState(card.priority)
    const [isEditting, setIsEditting] = useState(false)
    const [formData, setFormData] = useState({
        title: card.title,
        priority: card.priority,
        description: card.description,
        columnId
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.put(`/cards/${card._id}`, formData)
        const updateCard = res.data.card;
        setColumns((prev) => prev.map(column => ({
            ...column, cards: column.cards.map(card => card._id === updateCard._id ? updateCard : card)
        })
        ))
        console.log(formData)
        console.log(res.data)

    }
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: card._id })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        willChange: 'transform'
    }

    const handleCardDelete = async () => {
        try {
            await axios.delete(`/cards/${card._id}`)
            setColumns(prev =>
                prev.map(column =>
                ({
                    ...column,
                    cards: (column.cards.filter(c => c._id !== card._id)),
                })
                ))
            console.log('deleted')
        } catch (err) {
            console.log('didnt deleted because', err)
        }
    }
    const handleSwitch = () => {
        setIsEditting((prev => !prev))
    }

    return (

        isEditting ? (
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

        ) : (

            <Box
                ref={setNodeRef}
                style={style}
                className='card'
                sx={{ display: 'flex', alignItems: 'center', gap: '10px', p: 1, borderRadius: '15px', backgroundColor: '#fff', color: '#000', marginBottom: '10px' }} >

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Box
                        {...attributes}
                        {...listeners}
                        sx={{ cursor: "grab" }}
                    >
                        <DragIndicator />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 300, fontSize: '1.5rem' }} gutterBottom>
                        {card.title}
                    </Typography>
                    {/* <h3 className='card__head'></h3> */}
                    <h4 className={`${card.priority}`}>{card.priority.toUpperCase()}</h4>
                    <CardList handleCardDelete={handleCardDelete} handleSwitch={handleSwitch} />
                </Box>
                <Typography variant="body2" gutterBottom>
                    {card.description}
                </Typography>
            </Box >

        )







    )
}
