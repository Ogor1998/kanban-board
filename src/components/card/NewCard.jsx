import { useState } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Autocomplete,
    Divider,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';

import FileUpload from '../reuseable/FileUpload';
import DateSelector from '../reuseable/DateSelector';
import { createCard } from '../../api/cards';
import { useNotification } from '../../context/NotificationContext';
import { useBoard } from '../../context/BoardContext';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '92vw', sm: 540 },
    maxHeight: '90vh',
    bgcolor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    outline: 'none'
};

const priorities = ['low', 'medium', 'high'];

export default function NewCardModal({
    open,
    onClose,
    setColumns,
    columnId,
    columnTitle = 'Column'
}) {
    const { setMessage } = useNotification();
    const { fetchBoards } = useBoard();

    const [formData, setFormData] = useState({
        title: '',
        priority: 'medium',
        description: ''
    });
    const [dateValue, setDateValue] = useState(null);
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const resetForm = () => {
        setFormData({ title: '', priority: 'medium', description: '' });
        setDateValue(null);
        setFiles([]);
        setPreviews([]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDeletePreview = (idx) => {
        setPreviews(prev => prev.filter((_, index) => index !== idx));
        setFiles(prev => prev.filter((_, index) => index !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setMessage({ text: 'Card title is required', severity: 'warning' });
            return;
        }

        setSubmitting(true);
        try {
            const form = new FormData();
            form.append('columnId', columnId);
            form.append('title', formData.title.trim());
            form.append('description', formData.description.trim());
            form.append('priority', formData.priority || 'medium');

            if (dateValue) {
                const isoDate = typeof dateValue.toISOString === 'function'
                    ? dateValue.toISOString()
                    : dateValue;
                form.append('dueDate', isoDate);
            }

            files.forEach((file) => {
                form.append('images', file);
            });

            const res = await createCard(form);
            const newCard = res.data.card;

            setColumns(prev =>
                prev.map(col =>
                    col._id === columnId
                        ? { ...col, cards: [...(col.cards || []), newCard] }
                        : col
                )
            );

            await fetchBoards();
            setMessage({ text: 'Card created successfully', severity: 'success' });
            handleClose();
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || 'Error creating card',
                severity: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle} component="form" onSubmit={handleSubmit} noValidate>
                {/* Header */}
                <Box sx={{
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <Box>
                        <Typography variant="h6" fontWeight={600} fontSize="1.1rem">
                            Create New Card
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Adding to <strong style={{ textTransform: 'capitalize' }}>{columnTitle}</strong>
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Form Fields */}
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5, overflowY: 'auto' }}>
                    {/* Title */}
                    <TextField
                        name="title"
                        label="Card Title"
                        placeholder="What needs to be done?"
                        required
                        fullWidth
                        value={formData.title}
                        onChange={handleChange}
                        autoFocus
                    />

                    {/* Metadata Row: Priority & Due Date */}
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                <FlagOutlinedIcon fontSize="small" color="action" />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    Priority
                                </Typography>
                            </Box>
                            <Autocomplete
                                options={priorities}
                                getOptionLabel={(option) => option.toUpperCase()}
                                value={formData.priority}
                                onChange={(_, newValue) => {
                                    setFormData(prev => ({ ...prev, priority: newValue || 'medium' }));
                                }}
                                renderInput={(params) => <TextField {...params} size="small" />}
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                <CalendarMonthIcon fontSize="small" color="action" />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    Due Date
                                </Typography>
                            </Box>
                            <DateSelector dateValue={dateValue} setDateValue={setDateValue} />
                        </Box>
                    </Box>

                    {/* Description */}
                    <TextField
                        name="description"
                        label="Description"
                        placeholder="Add more details or instructions..."
                        multiline
                        rows={3}
                        fullWidth
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <Divider />

                    {/* Attachments Section */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <AttachFileIcon fontSize="small" color="action" />
                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                                Attachments ({previews.length})
                            </Typography>
                        </Box>

                        {previews.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                {previews.map((src, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            position: 'relative',
                                            width: 72,
                                            height: 72,
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
                                            onClick={() => handleDeletePreview(index)}
                                            sx={{
                                                position: 'absolute',
                                                top: 2,
                                                right: 2,
                                                p: 0.4,
                                                bgcolor: 'rgba(0,0,0,0.65)',
                                                color: '#fff',
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                                '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.9)' }
                                            }}
                                        >
                                            <DeleteIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}
                        <FileUpload setFile={setFiles} setPreviews={setPreviews} />
                    </Box>
                </Box>

                {/* Footer Controls */}
                <Box sx={{
                    px: 3,
                    py: 1.5,
                    bgcolor: '#fafbfc',
                    borderTop: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1.5
                }}>
                    <Button variant="text" color="inherit" onClick={handleClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                        sx={{ px: 3, borderRadius: '8px' }}
                    >
                        {submitting ? <CircularProgress size={20} color="inherit" /> : 'Create Card'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}