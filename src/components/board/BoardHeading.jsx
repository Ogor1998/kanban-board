import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Avatar,
    AvatarGroup,
    Tooltip,
    MenuItem,
    Select,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Share as ShareIcon,
    History as HistoryIcon,
    Close as CloseIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useNotification } from '../../context/NotificationContext';
import { useBoard } from '../../context/BoardContext';
import { useAuth } from '../../context/AuthContext';
import { findBoard } from '../../api/boards';
import usePermissions from '../../hooks/usePermissions';
import { kanbanBackgrounds } from '../../utils/kanbanBackgrounds';

import SearchField from '../reuseable/SearchField';
import InviteComponent from '../invitation/InviteComponent';
import ActivityModal from '../activity/ActivityModal';
import './BoardHeading.css';

export default function BoardHeading({
    boardId,
    setPriorityFilter,
    priorityFilter = '',
    setSearch,
    setBoardBackground,
    boardBackground = ''
}) {
    const navigate = useNavigate();
    const { setMessage } = useNotification();
    const { deleteBoard } = useBoard();
    const { currentUser } = useAuth();

    const [board, setBoard] = useState({});
    const [titleInput, setTitleInput] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Modals
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openInviteModal, setOpenInviteModal] = useState(false);
    const [openActivityModal, setOpenActivityModal] = useState(false);

    const { isAdmin, isMember, isOwner, canEdit } = usePermissions(board);

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const res = await findBoard(boardId);
                setBoard(res.data);
                setTitleInput(res.data.title || '');
            } catch (err) {
                console.error('Failed to load board details:', err);
            }
        };
        if (boardId) fetchBoardData();
    }, [boardId]);

    const handleEditToggle = () => {
        setTitleInput(board.title || '');
        setIsEditing((prev) => !prev);
    };

    const handleTitleSubmit = async (e) => {
        e.preventDefault();
        if (!titleInput.trim()) return;

        try {
            const res = await axios.put(`/boards/${boardId}`, { title: titleInput });
            const updatedTitle = res.data.board?.title || titleInput;
            setBoard((prev) => ({ ...prev, title: updatedTitle }));
            setIsEditing(false);
            setMessage({ text: res.data.message || 'Board renamed successfully', severity: 'success' });
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || 'Error updating board title',
                severity: 'error'
            });
        }
    };

    const handleDeleteBoard = async () => {
        try {
            await deleteBoard(boardId);
            setOpenDeleteModal(false);
            navigate('/');
        } catch (err) {
            setMessage({ text: 'Failed to delete board', severity: 'error' });
        }
    };

    return (
        <Box
            className="board__top"
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                px: 2.5,
                py: 1.5,
            }}
        >
            {/* Left: Title or Inline Rename Form */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 260 }}>
                {isEditing ? (
                    <Box
                        component="form"
                        onSubmit={handleTitleSubmit}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <TextField
                            size="small"
                            variant="outlined"
                            autoFocus
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                    color: 'inherit'
                                }
                            }}
                        />
                        <IconButton size="small" type="submit" sx={{ color: 'inherit' }}>
                            <CheckIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={handleEditToggle} sx={{ color: 'inherit' }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                            variant="h5"
                            component="h1"
                            sx={{ fontWeight: 700, color: 'inherit', letterSpacing: '-0.02em' }}
                        >
                            {board.title || 'Untitled Board'}
                        </Typography>
                        {canEdit && (
                            <Tooltip title="Rename Board">
                                <IconButton size="small" onClick={handleEditToggle} sx={{ color: 'inherit', opacity: 0.8 }}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                )}
            </Box>

            {/* Center: Search & Group/Background Filters */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <SearchField setSearch={setSearch} />

                {/* Priority Filter */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        displayEmpty
                        sx={{
                            color: 'inherit',
                            bgcolor: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '8px',
                            '& .MuiSvgIcon-root': { color: 'inherit' }
                        }}
                    >
                        <MenuItem value="">Group: All</MenuItem>
                        <MenuItem value="low">Low Priority</MenuItem>
                        <MenuItem value="medium">Medium Priority</MenuItem>
                        <MenuItem value="high">High Priority</MenuItem>
                    </Select>
                </FormControl>

                {/* Background Selector */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <Select
                        value={boardBackground || ''}
                        onChange={(e) => setBoardBackground(e.target.value)}
                        displayEmpty
                        sx={{
                            color: 'inherit',
                            bgcolor: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '8px',
                            '& .MuiSvgIcon-root': { color: 'inherit' }
                        }}
                    >
                        <MenuItem value="">Theme / Background</MenuItem>
                        {Object.entries(kanbanBackgrounds).map(([key, val]) => (
                            <MenuItem value={key} key={key}>
                                {val.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Right: Members & Action Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {board?.members?.length > 0 && (
                    <AvatarGroup max={4} sx={{ mr: 1 }}>
                        {board.members.map((member) => (
                            <Tooltip key={member._id} title={member.user?.username || 'Member'}>
                                <Avatar
                                    alt={member.user?.username}
                                    src={member.user?.image}
                                    onClick={() => navigate(`/profile/${member.user?.username}`)}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        cursor: 'pointer',
                                        border: '2px solid rgba(255,255,255,0.7) !important'
                                    }}
                                >
                                    {member.user?.username?.charAt(0).toUpperCase()}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </AvatarGroup>
                )}

                <Tooltip title="Activity Log">
                    <IconButton sx={{ color: 'inherit' }} onClick={() => setOpenActivityModal(true)}>
                        <HistoryIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                {isOwner && (
                    <Tooltip title="Invite Members">
                        <IconButton sx={{ color: 'inherit' }} onClick={() => setOpenInviteModal(true)}>
                            <ShareIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

                {canEdit && (
                    <Tooltip title="Delete Board">
                        <IconButton sx={{ color: 'inherit' }} onClick={() => setOpenDeleteModal(true)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Modals & Dialogs */}
            <InviteComponent
                openInvite={openInviteModal}
                closeInviteModal={() => setOpenInviteModal(false)}
                boardId={boardId}
                isOwner={isOwner}
                board={board}
            />

            <ActivityModal
                boardId={boardId}
                open={openActivityModal}
                setOpenActivity={setOpenActivityModal}
                onClose={() => setOpenActivityModal(false)}
            />

            <Dialog
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                PaperProps={{
                    sx: { borderRadius: '14px', p: 1, bgcolor: '#ffffff' }
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Delete this board?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will permanently remove <strong>'{board.title}'</strong>, its columns, and all associated cards. This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button onClick={() => setOpenDeleteModal(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteBoard} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}