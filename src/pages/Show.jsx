import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import './Show.css'
import { Box, TextField, Button } from '@mui/material'
import Heading from '../components/Heading'
import { DragOverlay } from '@dnd-kit/core'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableCard from '../components/SortAbleCard'
import AddIcon from '@mui/icons-material/Add';
import NewCard from '../components/NewCard'
import { useNotification } from '../context/NotificationContext'
import AlertBox from '../components/AlertBox'
import NewColumnModal from '../components/NewColumnModal'
import { arrayMove } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'


const Show = () => {
    const { boardId } = useParams();
    const { message, setMessage } = useNotification();
    const navigate = useNavigate();

    const [columns, setColumns] = useState([])

    const [formData, setFormData] = useState({ title: "", boardId })
    const [activeCard, setActiveCard] = useState(null)
    const [isActiveColumn, setisActiveColumn] = useState(null)
    useEffect(() => {
        const fetchColumns = async () => {
            try {
                const res = await axios.get(`/columns/${boardId}`)
                console.log('this is the full data object', res.data)
                setColumns(res.data.columns)

            } catch (err) {
                navigate('/error', {
                    state: {
                        statusCode: err.response?.status,
                        message: err.response?.data?.message,
                        stack: err.stack
                    }
                })

            }

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
            setMessage({ text: res.data.message, severity: 'success' })
            setColumns((prev) => [...prev, { ...res.data.column, cards: [] }])
        } catch (err) {
            setMessage({ text: err.response?.data?.message || "Something went wrong", severity: 'error' })
        }
    }

    const handleClick = (id) => {
        setisActiveColumn(prev => prev === id ? null : id)
    }

    const handleDragEnd = async (event) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        setActiveCard(null)

        // Find which column the dragged card came from
        const sourceColumn = columns.find(col =>
            col.cards?.some(card => card._id === active.id)
        )
        // Find which column it was dropped on
        const targetColumn = columns.find(col =>
            col.cards?.some(card => card._id === over.id) || col._id === over.id
        )

        if (!sourceColumn || !targetColumn) return

        if (sourceColumn._id === targetColumn._id) {
            // Same column - reorder
            const oldIndex = sourceColumn.cards.findIndex(c => c._id === active.id)
            const newIndex = sourceColumn.cards.findIndex(c => c._id === over.id)
            const newCards = arrayMove(sourceColumn.cards, oldIndex, newIndex)
            setColumns(prev => prev.map(col =>
                col._id === sourceColumn._id ? { ...col, cards: newCards } : col
            ))
        } else {
            // Different column - move card
            const card = sourceColumn.cards.find(c => c._id === active.id)
            setColumns(prev => prev.map(col => {
                if (col._id === sourceColumn._id) {
                    return { ...col, cards: col.cards.filter(c => c._id !== active.id) }
                }
                if (col._id === targetColumn._id) {
                    return { ...col, cards: [...col.cards, card] }
                }
                return col
            }))

            // Update backend
            await axios.patch(`/cards/${active.id}/move`, { columnId: targetColumn._id })
        }
    }

    const handleDelete = async (id) => {
        const res = await axios.delete(`/columns/${id}/`)
        setColumns((prev) => prev.filter(col => col._id !== id))
        setMessage({ text: res.data.message, severity: 'error' })
        console.log('Deleted Column')
    }

    function DroppableColumn({ col, children }) {
        const { setNodeRef } = useDroppable({ id: col._id })
        return (
            <div ref={setNodeRef} key={col._id} className='row'>
                {children}
            </div>
        )
    }

    return (
        <Box className='big__container'>
            {message && <div>   <AlertBox /></div>}

            <div className='board'>

                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>

                    {columns.map((col) => (
                        <DroppableColumn key={col._id} col={col}>
                            <Heading col={col} handleDelete={handleDelete} setColumns={setColumns} />
                            <SortableContext
                                items={col.cards?.map(card => card._id) || []}
                                strategy={verticalListSortingStrategy}
                            >
                                {col.cards?.map((card) => (
                                    <SortableCard key={card._id} card={card} columnId={col._id} setColumns={setColumns} />
                                ))}
                            </SortableContext>
                            {isActiveColumn === col._id && <NewCard setColumns={setColumns} columnId={col._id} setisActiveColumn={setisActiveColumn} />}
                            <Button sx={{ color: '#fff' }} onClick={() => handleClick(col._id)}>
                                <AddIcon />Add Card
                            </Button>
                        </DroppableColumn>
                    ))}
                </DndContext>
                <NewColumnModal handleChange={handleChange} formData={formData} handleSubmit={handleSubmit} />

            </div>
        </Box>


    )
}

export default Show