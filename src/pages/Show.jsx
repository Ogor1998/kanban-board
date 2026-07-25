import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import './Show.css'
import { Box, TextField, Button } from '@mui/material'
import Heading from '../components/Heading'
import { DragOverlay } from '@dnd-kit/core'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableCard from '../components/SortAbleCard'
import AddIcon from '@mui/icons-material/Add';
import NewCard from '../components/NewCard'


const Show = () => {
    const { boardId } = useParams();

    const [columns, setColumns] = useState([])

    const [formData, setFormData] = useState({ title: "" })
    const [activeCard, setActiveCard] = useState(null)
    const [isActiveColumn, setisActiveColumn] = useState(null)
    useEffect(() => {
        const fetchColumns = async () => {
            const res = await axios.get(`/columns/${boardId}`)
            console.log('this is the full data object', res.data)
            setColumns(res.data.columns)


        }
        fetchColumns();
    }, [boardId])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/columns`, {
                title: formData.title,
                boardId,
            })
            setColumns((prev) => [...prev, res.data.columns])
        } catch (err) {
            console.log(err)
        }
    }

    const handleClick = (id) => {
        setisActiveColumn(prev => prev === id ? null : id)
    }

    const handleDragEnd = async (event) => {
        const { active, over } = event
        if (!over) return
        setActiveCard(null)
        // update card's columnId in state and send PATCH to backend
    }

    const handleDelete = async (id) => {
        const res = await axios.delete(`/columns/${id}/`)
        setColumns((prev) => prev.filter(col => col._id !== id))
        console.log('Deleted Column')
    }

    return (
        <div className='board'>

            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>

                {columns.map((col) => (
                    <div key={col._id} className='row'>
                        <Heading col={col} handleDelete={handleDelete} />
                        <SortableContext
                            items={col.cards?.map(card => card._id) || []}  // ← array of IDs
                            strategy={verticalListSortingStrategy}
                        >
                            {col.cards?.map((card) => (
                                <SortableCard key={card._id} card={card} setColumns={setColumns} />

                            ))}
                        </SortableContext>

                        {isActiveColumn === col._id && <NewCard setColumns={setColumns} columnId={col._id} />}
                        <Button sx={{ color: '#fff' }} onClick={() => handleClick(col._id)}><AddIcon />Add Card</Button>
                    </div>
                ))}
            </DndContext>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
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
        </div>


    )
}

export default Show