import { useState } from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AlertBox from '../components/common/AlertBox'
import NewBoardModal from '../components/board/NewBoardModal';
import { Box, Button, Typography, CircularProgress, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { useBoard } from '../context/BoardContext'
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { useLocation, useNavigate } from 'react-router-dom';


const getmemberLabel = (members, currentUserId) => {
    const membersList = Array.isArray(members) ? members : [];
    if (membersList.length === 0) return 'No members';
    const isUserMember = membersList.some(m => String(m?._id || m) === String(currentUserId));
    if (isUserMember && membersList.length === 1) return 'Just you';
    if (isUserMember) {
        const othersCount = membersList - 1;
        return `You + ${othersCount} other${othersCount > 1 ? 's' : ''}`;
    }
    return `${membersList.length} member${membersList.length > 1 ? 's' : ''}`;
};

const Home = () => {
    const { board: boards, setBoard, deleteBoard, loading, } = useBoard();
    const [open, setOpen] = useState(false);

    const { currentUser, isLoggedIn } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();
    const handleOpen = () => {
        console.log('clicked handle open')
        if (!isLoggedIn) {
            navigate("/login", {
                state: {
                    from: location,
                    message: "Please log in to create a board",
                },
            });
        } else {
            setOpen(true)
        }
    };
    const [formData, setFormData] = useState({
        title: ""
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress aria-label="Loading…" />
            </Box>
        );
    }

    if (!boards || boards.length === 0) {
        return (
            <Box sx={{ m: 1 }} className='no__data'>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '3rem' }}>
                    You don't have any boards yet.
                </Typography>
                <NewBoardModal
                    setFormData={setFormData}
                    formData={formData}
                />
            </Box>
        );
    }


    return (
        <div className='home'>
            <AlertBox />
            <div className="home__container">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #000', p: 1, alignItems: 'center' }}>
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.primary', display: 'inline' }}
                    >
                        My Boards
                    </Typography>
                    <Button onClick={handleOpen}><AddIcon />Add Board</Button>
                </Box>
                <Box component='container' className='container__inner' sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>

                    {boards.map((b) => {
                        const ownerId = b.owner?._id || b.owner;
                        const canDelete = currentUser?._id && String(currentUser._id) === String(ownerId);
                        const memberLabel = getmemberLabel(b?.members, currentUser?._id);
                        const cardsCount = (value) => {
                            if (value < 1) {
                                return `No cards yet`
                            }
                            return `Total card ${value}`

                        }
                        console.log('this is columns', cardsCount(b.cardsCount))
                        return (
                            <Box
                                className='board__box'
                                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                                key={b._id}
                            >
                                <Box className='theBox' sx={{ height: '100px', width: '100%', backgroundColor: '#000' }}>

                                </Box>
                                <Link to={`/columns/${b._id}`}>{b.title}</Link>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{ color: 'text.secondary', display: 'inline' }}
                                >
                                    Total Columns <strong>{b.columnsCount}</strong>
                                </Typography>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{ color: 'text.secondary', display: 'inline' }}
                                >
                                    <strong>{cardsCount(b.cardsCount)}</strong>
                                </Typography>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{ color: 'text.secondary', display: 'inline' }}
                                >
                                    {memberLabel}
                                </Typography>
                            </Box>
                        );
                    })}
                    <Box className='board__box' onClick={handleOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><IconButton onClick={handleOpen}><AddIcon /></IconButton></Box>
                </Box>

                <NewBoardModal setFormData={setFormData} formData={formData} setBoard={setBoard} handleOpen={handleOpen} setOpen={setOpen} open={open} />
            </div>
        </div>
    );
};

export default Home;