import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, Button } from '@mui/material'
import '../pages/Show.css'
import { Typography } from '@mui/material'
import CardList from './CardList'
import DragIndicator from '@mui/icons-material/DragIndicator'
import axios from 'axios'


export default function SortableCard({ card, setColumns }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: card._id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
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

    return (

        <Box
            ref={setNodeRef}
            style={style}
            className='card'
            sx={{ display: 'flex', alignItems: 'center', gap: '10px', p: 1, borderRadius: '15px', backgroundColor: '#fff', color: '#000', marginBottom: '10px' }}>

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
                <CardList handleCardDelete={handleCardDelete} />
            </Box>
            {/* <p className='card__body'>{card.description}</p> */}
            <Typography variant="body2" gutterBottom>
                {card.description}
            </Typography>
        </Box>


    )
}
