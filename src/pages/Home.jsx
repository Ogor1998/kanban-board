import { useState } from 'react';
import './Home.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AlertBox from '../components/common/AlertBox';
import NewBoardModal from '../components/board/NewBoardModal';
import {
    Box,
    Button,
    Typography,
    IconButton,
    Avatar,
    AvatarGroup,
    Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useBoard } from '../context/BoardContext';
import { useAuth } from '../context/AuthContext';
import BoardSkeleton from '../skeletons/BoardSkeleton';

const Home = () => {
    const { board: boards, setBoard, loading } = useBoard();
    const [open, setOpen] = useState(false);
    const { currentUser, isLoggedIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: ""
    });

    const handleOpen = () => {
        if (!isLoggedIn) {
            navigate("/login", {
                state: {
                    from: location,
                    message: "Please log in to create a board",
                },
            });
        } else {
            setOpen(true);
        }
    };

    if (loading) {
        return (
            <div className='home'>
                <div className="home__container">
                    <BoardSkeleton />
                </div>
            </div>
        );
    }

    if (!boards || boards.length === 0) {
        return (
            <Box sx={{ m: 1 }} className='no__data'>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '2.5rem' }}>
                    You don't have any boards yet.
                </Typography>
                <Button variant="contained" onClick={handleOpen} startIcon={<AddIcon />}>
                    Create your first board
                </Button>
                <NewBoardModal
                    setFormData={setFormData}
                    formData={formData}
                    setBoard={setBoard}
                    handleOpen={handleOpen}
                    setOpen={setOpen}
                    open={open}
                />
            </Box>
        );
    }

    return (
        <div className='home'>
            <AlertBox />
            <div className="home__container">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        My Boards
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleOpen}
                        startIcon={<AddIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Add Board
                    </Button>
                </Box>

                {/* Boards Grid matching the Skeleton layout */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {boards.map((b) => {
                        const membersList = Array.isArray(b?.members) ? b.members : [];
                        console.log('this is memberslsit', membersList)

                        return (
                            <Box
                                key={b._id}
                                sx={{
                                    width: 200,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: '#fff',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                    }
                                }}
                            >
                                {/* Top Box - matches <Skeleton variant="rounded" height={80} /> */}
                                <Box
                                    component={Link}
                                    to={`/columns/${b._id}`}
                                    sx={{
                                        height: 80,
                                        width: '100%',
                                        borderRadius: 1.5,
                                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                        display: 'block',
                                        textDecoration: 'none',
                                        mb: 1
                                    }}
                                />

                                {/* Title - matches <Skeleton variant="text" width="60%" /> */}
                                <Typography
                                    component={Link}
                                    to={`/columns/${b._id}`}
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        color: 'text.primary',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        display: 'block',
                                        '&:hover': { color: 'primary.main' }
                                    }}
                                >
                                    {b.title}
                                </Typography>

                                {/* Subtitle stats - matches <Skeleton variant="text" width="40%" /> */}
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                    {b.columnsCount || 0} cols • {b.cardsCount || 0} cards
                                </Typography>


                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                                    {membersList.length > 0 ? (
                                        <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                                            {membersList.map((m, idx) => (
                                                <Tooltip key={m?._id || idx} title={m?.username || 'Member'}>
                                                    <Avatar sx={{ width: 24, height: 24 }} src={m.user.image}>
                                                        {(m?.username || 'M')[0].toUpperCase()}
                                                    </Avatar>
                                                </Tooltip>
                                            ))}
                                        </AvatarGroup>
                                    ) : (
                                        <Tooltip title="Only you">
                                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                {(currentUser?.username || 'U')[0].toUpperCase()}
                                            </Avatar>
                                        </Tooltip>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}

                    {/* "Add New Board" Dotted Action Card */}
                    <Box
                        onClick={handleOpen}
                        sx={{
                            width: 200,
                            minHeight: 180,
                            p: 2,
                            borderRadius: 2,
                            border: '2px dashed #e0e0e0',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            bgcolor: 'transparent',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'rgba(25, 118, 210, 0.04)'
                            }
                        }}
                    >
                        <IconButton color="primary">
                            <AddIcon />
                        </IconButton>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                            Create Board
                        </Typography>
                    </Box>
                </Box>

                <NewBoardModal
                    setFormData={setFormData}
                    formData={formData}
                    setBoard={setBoard}
                    handleOpen={handleOpen}
                    setOpen={setOpen}
                    open={open}
                />
            </div>
        </div>
    );
};

export default Home;