
import { useState, useEffect } from "react"
import { Box, Button, Autocomplete, Typography, TextField, Modal, IconButton, Avatar, AvatarGroup } from "@mui/material"
import FileUpload from '../reuseable/FileUpload';
import { updateACard } from '../../api/cards'
import { Delete } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import DateFormatComponent from "../common/DateFormatComponent";
import ChecklistSection from "./ChecklistSection";



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    textAlign: 'center',
    minHeight: '45rem',
    overflowY: 'scroll',
    borderRadius: '15px'
};

const CardDetailsModal = ({ card, columnId, setColumns, setOpen, open }) => {
    // const [open, setOpen] = useState(false);


    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false);
    const [formData, setFormData] = useState({
        title: card?.title,
        priority: card?.priority,
        description: card?.description,
        columnId
    })
    useEffect(() => {
        if (card) {
            setFormData({
                title: card.title || '',
                priority: card.priority || '',
                description: card.description || '',
                columnId
            });
            setValue(card.priority || '');
            setPreviews(card.images || []);
        }
    }, [card, columnId]);
    const priority = ['Low', 'Medium', 'High']
    const [value, setValue] = useState(card?.priority)
    const [file, setFile] = useState([])
    const [previews, setPreviews] = useState(card?.images)

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
        const res = await updateACard(card._id, form)
        const updateCard = res.data.card;
        setColumns((prev) => prev.map(column => ({
            ...column, cards: column.cards.map(card => card._id === updateCard._id ? updateCard : card)
        })
        ))
        console.log(formData)
        console.log(res.data)

    }

    const handlePreviewDelete = (idx) => {
        console.log('getting clicked')
        setPreviews(prev =>
            prev.filter((_, index) => index !== idx))
    }
    const dueDate = new Date(card?.dueDate);

    console.log('this is teh value', value)
    return (
        <div>
            <Button onClick={handleOpen}>Expand</Button>
            <Modal
                open={open}
                // style={style}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box style={style}>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: '#fff', p: 1,
                        borderRadius: '15px',
                        p: 3
                    }}

                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 300, fontSize: '1.5rem' }} gutterBottom>
                                Update Card
                            </Typography>
                            <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                        </Box>

                        <TextField
                            id="outlined-multiline-flexible"
                            label="Title"
                            multiline
                            maxRows={4}
                            name='title'
                            onChange={handleChange}
                            fullWidth
                            value={formData.title}
                        />

                        <TextField
                            id="outlined-multiline-static"
                            label="Description"
                            multiline
                            fullWidth
                            rows={2}
                            defaultValue="Description"
                            name='description'
                            onChange={handleChange}
                            value={formData.description}
                        />
                        <ChecklistSection checklist={card?.checklist} cardId={card?._id} setColumns={setColumns} />

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: "20px", alignItems: 'center' }}>
                            <Box>
                                <Autocomplete
                                    disablePortal
                                    options={priority}
                                    sx={{ width: 155, fontSize: '1.2rem' }}
                                    renderInput={(params) => <TextField {...params} label="Priority" />}
                                    onChange={(event, newValue) => {
                                        setValue(newValue)
                                        setFormData(prev => ({
                                            ...prev,
                                            priority: newValue,
                                        }));
                                    }}
                                    value={value}
                                />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 300, fontSize: '1.5rem' }} gutterBottom>
                                    Due Date
                                </Typography>
                                <DateFormatComponent dueDate={dueDate} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 300, fontSize: '1.5rem' }} gutterBottom>
                                    Memebers
                                </Typography>
                                <AvatarGroup spacing="small" max={3}>
                                    {card?.members?.map((member) => (
                                        <Avatar key={member._id} alt={member.username || 'Member'} src={member.image}
                                            onClick={() => visitProfile(member.username)} />
                                    ))}
                                </AvatarGroup>

                            </Box>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 300, fontSize: '1.5rem', textAlign: 'left', width: "100%" }} gutterBottom>
                            Attachments
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, overflowX: 'scroll', width: '100%', }}>
                            {previews?.map((src, index) => (
                                <div key={index}>
                                    <label htmlFor={index}></label>
                                    <img
                                        src={src}
                                        alt={`preview-${index}`}
                                        width="100"
                                        height='100'
                                    />
                                    <Delete onClick={() => handlePreviewDelete(index)} />
                                </div>
                            ))}
                        </Box>
                        <FileUpload setFile={setFile} setPreviews={setPreviews} />
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Button type='submit' variant="contained" onClick={handleSubmit}>Submit</Button>
                            <Button color='error' variant="contained" onClick={handleClose}>Cancel</Button>
                        </Box>
                    </Box>
                </Box>

            </Modal>
        </div>
    )
}

export default CardDetailsModal