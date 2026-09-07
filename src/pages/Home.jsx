import { useState } from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AlertBox from '../components/AlertBox'
import NewBoardModal from '../components/NewBoardModal'
import { Box, Button } from '@mui/material'
import Delete from '@mui/icons-material/Delete'
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material'
import { useBoard } from '../context/BoardContext'
import { useAuth } from '../context/AuthContext';



const Home = () => {
    const { board, setBoard, deleteBoard, loading } = useBoard();
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        title: ""
    })

    if (loading) {
        return <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress aria-label="Loading…" />
        </Box>;
    }

    if (board.length === 0) {
        return (
            <Box sx={{ m: 1, }} className='no__data'>
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
                {board.map((board) => {
                    const canDelete = currentUser?._id.toString() === board.owner?.toString();
                    return (
                        <Box className='links' key={board._id}>
                            <Link to={`/columns/${board._id}`} >{board.title}</Link>
                            {canDelete && <Button onClick={() => deleteBoard(board._id)}><Delete /></Button>}
                        </Box>
                    )
                })}
                <div>
                </div>
                <NewBoardModal setFormData={setFormData} formData={formData} setBoard={setBoard} />
            </div>
        </div>
    )
}

export default Home