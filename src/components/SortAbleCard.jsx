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
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import FileUpload from './FileUpload';
import Delete from '@mui/icons-material/Delete'


export default function SortableCard({ card, setColumns, columnId }) {
    const priority = ['low', 'medium', 'high']
    const [value, setValue] = useState(card.priority)
    const [file, setFile] = useState([])
    const [previews, setPreviews] = useState(card.images)
    const [isEditting, setIsEditting] = useState(false)
    const [formData, setFormData] = useState({
        title: card.title,
        priority: card.priority,
        description: card.description,
        columnId
    })

    console.log('this is the card object', card)

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
            </Box>

        ) : (

            <Box
                ref={setNodeRef}
                style={style}
                className='card'
                sx={{ display: 'flex', alignItems: 'center', gap: '10px', p: 1, borderRadius: '15px', backgroundColor: '#fff', color: '#000', marginBottom: '10px' }} >

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
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

                    <h4 className={`${card.priority}`}>{card.priority.toUpperCase()}</h4>
                    <CardList handleCardDelete={handleCardDelete} handleSwitch={handleSwitch} />
                </Box>
                {card.images?.length > 0 &&
                    <Carousel showThumbs={false}      // ← removes bottom thumbnails
                        showStatus={false}      // ← removes "1 of 3" counter
                        showIndicators={true}   // ← keeps the dots at bottom
                        infiniteLoop={true}     // ← loops back to start
                        width="100%"
                    >
                        {card.images?.map((src, index) => (
                            <div key={index}>
                                <img src={src} alt={`preview-${index}`}
                                    style={{
                                        width: '100%',
                                        height: '150px',
                                        objectFit: 'cover',  // ← prevents stretching
                                        borderRadius: '10px'
                                    }} />
                            </div>
                        ))}
                    </Carousel>
                }
                <Typography variant="body2" gutterBottom>
                    {card.description}
                </Typography>
            </Box >

        )







    )
}
