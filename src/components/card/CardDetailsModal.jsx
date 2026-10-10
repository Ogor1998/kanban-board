import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Modal,
    IconButton,
    Avatar,
    AvatarGroup,
    Chip,
    Divider,
    MenuItem,
    Select,
    FormControl,
    Tooltip
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';

import FileUpload from '../reuseable/FileUpload';
import DateFormatComponent from "../common/DateFormatComponent";
import ChecklistSection from "./ChecklistSection";
import { updateACard } from '../../api/cards';
import { useNotification } from "../../context/NotificationContext";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '92vw', sm: 780 },
    maxHeight: '88vh',
    bgcolor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    outline: 'none'
};

const CardDetailsModal = ({ card, columnId, setColumns, setOpen, open, columnTitle }) => {
    const { setMessage } = useNotification();
    const [formData, setFormData] = useState({
        title: card?.title || '',
        description: card?.description || '',
        priority: card?.priority || 'medium'
    });
    const [file, setFile] = useState([]);
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        if (card) {
            setFormData({
                title: card.title || '',
                description: card.description || '',
                priority: card.priority || 'medium'
            });
            setPreviews(card.images || []);
        }
    }, [card]);

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePriorityChange = (e) => {
        setFormData(prev => ({ ...prev, priority: e.target.value }));
    };

    const handlePreviewDelete = (idx) => {
        setPreviews(prev => prev.filter((_, index) => index !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            form.append("title", formData.title);
            form.append("description", formData.description);
            form.append("priority", formData.priority);
            form.append("columnId", columnId);

            file.forEach((image) => {
                form.append('images', image);
            });

            const res = await updateACard(card._id, form);
            const updateCard = res.data.card;

            setColumns(prev => prev.map(col => ({
                ...col,
                cards: col.cards.map(c => c._id === updateCard._id ? updateCard : c)
            })));

            setMessage({ text: 'Card updated successfully', severity: 'success' });
            handleClose();
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Update failed', severity: 'error' });
        }
    };

    const dueDate = card?.dueDate ? new Date(card.dueDate) : null;

    const priorityColors = {
        low: { color: '#2e7d32', bg: '#edf7ed' },
        medium: { color: '#ed6c02', bg: '#fff4e5' },
        high: { color: '#d32f2f', bg: '#fdeded' }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                {/* Modal Header */}
                <Box sx={{
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                            size="small"
                            label={formData.priority.toUpperCase()}
                            sx={{
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                color: priorityColors[formData.priority]?.color,
                                bgcolor: priorityColors[formData.priority]?.bg
                            }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            in list <strong style={{ textTransform: 'capitalize' }}>{columnTitle || 'Column'}</strong>
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Modal Body: Two-Column Responsive Split */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    flex: 1,
                    overflowY: 'auto'
                }}>
                    {/* Primary Content (Left Pane) */}
                    <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Title Input */}
                        <TextField
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Card Title"
                            variant="standard"
                            multiline
                            fullWidth
                            InputProps={{
                                disableUnderline: false,
                                sx: { fontSize: '1.4rem', fontWeight: 600, color: '#1a1a1a' }
                            }}
                        />

                        {/* Description Section */}
                        <Box>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                DESCRIPTION
                            </Typography>
                            <TextField
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Add more detailed context..."
                                multiline
                                minRows={3}
                                fullWidth
                                variant="outlined"
                                sx={{
                                    bgcolor: '#fafafa',
                                    borderRadius: '8px',
                                    '& fieldset': { borderColor: '#e0e0e0' }
                                }}
                            />
                        </Box>

                        {/* Checklist Section */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <ChecklistRtlIcon fontSize="small" color="action" />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    CHECKLIST
                                </Typography>
                            </Box>
                            <ChecklistSection checklist={card?.checklist} cardId={card?._id} setColumns={setColumns} />
                        </Box>

                        {/* Attachments Section */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <AttachFileIcon fontSize="small" color="action" />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    ATTACHMENTS ({previews?.length || 0})
                                </Typography>
                            </Box>

                            {previews?.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                    {previews.map((src, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                position: 'relative',
                                                width: 80,
                                                height: 80,
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                border: '1px solid #e0e0e0',
                                                '&:hover .delete-btn': { opacity: 1 }
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={src}
                                                alt={`preview-${index}`}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <IconButton
                                                className="delete-btn"
                                                size="small"
                                                onClick={() => handlePreviewDelete(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 2,
                                                    right: 2,
                                                    p: 0.5,
                                                    bgcolor: 'rgba(0,0,0,0.6)',
                                                    color: '#fff',
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s',
                                                    '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.9)' }
                                                }}
                                            >
                                                <DeleteIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                            <FileUpload setFile={setFile} setPreviews={setPreviews} />
                        </Box>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

                    {/* Metadata Sidebar (Right Pane) */}
                    <Box sx={{
                        width: { xs: '100%', md: 240 },
                        bgcolor: '#fafbfc',
                        p: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5
                    }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={0.5}>
                            DETAILS
                        </Typography>

                        {/* Priority Selector */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                                <FlagOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    Priority
                                </Typography>
                            </Box>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={formData.priority}
                                    onChange={handlePriorityChange}
                                    sx={{ bgcolor: '#fff', fontSize: '0.875rem' }}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Due Date */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                                <CalendarMonthIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    Due Date
                                </Typography>
                            </Box>
                            <Box sx={{ bgcolor: '#fff', p: 1, borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                                <DateFormatComponent dueDate={dueDate} />
                            </Box>
                        </Box>

                        {/* Assignees */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                                <AccountCircleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    Members
                                </Typography>
                            </Box>
                            {card?.members?.length > 0 ? (
                                <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                                    {card.members.map((member) => (
                                        <Tooltip title={member.firstname || member.username} key={member._id}>
                                            <Avatar
                                                src={member.image}
                                                alt={member.username}
                                                sx={{ width: 30, height: 30, fontSize: '0.8rem' }}
                                            >
                                                {member.username?.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </Tooltip>
                                    ))}
                                </AvatarGroup>
                            ) : (
                                <Typography variant="caption" color="text.secondary">No members assigned</Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Modal Footer Actions */}
                <Box sx={{
                    px: 3,
                    py: 1.5,
                    bgcolor: '#fff',
                    borderTop: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1.5
                }}>
                    <Button variant="text" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit} sx={{ px: 3, borderRadius: '8px' }}>
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CardDetailsModal;