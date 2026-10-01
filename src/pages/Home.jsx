import { useState } from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AlertBox from '../components/common/AlertBox'
import NewBoardModal from '../components/board/NewBoardModal';
import { Box, Button, Typography, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { useBoard } from '../context/BoardContext'
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

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
    const { board: boards, setBoard, deleteBoard, loading } = useBoard();

    const { currentUser } = useAuth();
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
                <Box component="header" sx={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #000', p: 1, alignItems: 'center' }}>
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.primary', display: 'inline' }}
                    >
                        My Boards
                    </Typography>
                    <Button><AddIcon />Add Board</Button>
                </Box>
                <Box component='container' className='container__inner' sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>

                    {boards.map((b) => {
                        const ownerId = b.owner?._id || b.owner;
                        const canDelete = currentUser?._id && String(currentUser._id) === String(ownerId);
                        const memberLabel = getmemberLabel(b?.members, currentUser?._id);
                        const { data: columns } = useFetch(`/columns/${b._id}`, (data) => data.columns);
                        const fetchTotalCardCount = (columns) => {
                            return columns
                                .flatMap(col => col.cards)
                                .reduce((accumulator, card) => accumulator + 1, 0);
                        };


                        console.log(fetchTotalCardCount(columns))
                        console.log('this is columns', columns)
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
                                    Total Columns <strong>{columns.length}</strong>
                                </Typography>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{ color: 'text.secondary', display: 'inline' }}
                                >
                                    Total Card <strong>{fetchTotalCardCount(columns)}</strong>
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
                </Box>

                <NewBoardModal setFormData={setFormData} formData={formData} setBoard={setBoard} />
            </div>
        </div>
    );
};

export default Home;