import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, Button } from '@mui/material'
import '../../pages/Show.css'
import { Typography } from '@mui/material'
import CardList from './CardList'
import DragIndicator from '@mui/icons-material/DragIndicator'
import { useState } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import CommentsModal from '../comments/CommentsModal'
import EditCard from './EditCard'
import { deleteCard } from '../../api/cards'
import CardInviteComponent from '../CardInviteComponent'
import { Stack, Avatar, AvatarGroup } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function SortableCard({ card, setColumns, columnId }) {
    const [isEditting, setIsEditting] = useState(false)
    const navigate = useNavigate();
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
            await deleteCard(card._id)
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
    const visitProfile = (username) => {
        return navigate(`/profile/${username}`)
    }

    return (

        isEditting ? (

            <EditCard card={card} handleSwitch={handleSwitch} columnId={columnId} setColumns={setColumns} />
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
                {
                    <Box  >
                        <AvatarGroup spacing="small" max={3}>
                            {card.members.map((member) => (
                                <Avatar key={member._id} alt={member.username || 'Member'} src={member.image}
                                    onClick={() => visitProfile(member.username)} />
                            ))}
                        </AvatarGroup>
                    </Box>
                }
                <Typography variant="body2" gutterBottom>
                    {card.description}
                </Typography>



                <CommentsModal card={card} setColumns={setColumns} />
            </Box >

        )







    )
}
