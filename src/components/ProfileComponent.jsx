console.log("ProfileComponent loaded")
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Button,
    Paper
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Divider from '@mui/material/Divider';
import TabComponent from "./TabComponent";
import '../pages/profile/Profile.css'
import { useState, useEffect } from "react";
import axios from "axios";



export default function ProfileComponent({ profile, handleClick }) {
    const { currentUser } = useAuth();
    const [board, setBoard] = useState([])
    const [commentsCount, setCommentsCount] = useState(0)
    const [cardsCount, setCardsCount] = useState(0)
    const [boardsCount, setboardsCount] = useState(0)
    const [loading, setLoading] = useState(true)

    if (!profile) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    useEffect(() => {
        if (!profile) return
        if (profile) {
            const fetchBoards = async () => {
                try {
                    const res = await axios.get(`/boards/user/${profile.username}`)
                    setBoard(res.data.board)
                    setboardsCount(res.data.boardCount)
                    setCommentsCount(res.data.commentsCount)
                    console.log('this is board', res.data.board)
                    // console.log('this is the request', res.data)
                    // console.log('this is the board', res.data)
                } catch (err) {
                    console.log(err)
                } finally {
                    setLoading(false)
                }
            }
            fetchBoards();
        }
    }, [profile])
    const allowedToEditProfile =
        profile._id === currentUser?._id;

    const style = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        mb: 5,
        p: 3
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, height: '100%' }}>
                <CircularProgress size={30} />
            </Box>
        );
    }


    return (
        <Box
            sx={{
                display: "flex",
                // justifyContent: "center",
                mt: 5,
                // width: '100%'
                // minHeight: '50rem'
            }}
            className='profile__box'

        >
            <Card sx={{ boxShadow: ' 10px 10px 20px rgba(0, 0, 0, 0.3)' }}>
                <CardContent>
                    <Box
                        style={style}
                        elevation={3}
                    >
                        <Avatar
                            src={profile.image}
                            alt={profile.username}
                            sx={{ width: 100, height: 100, marginRight: '2rem' }}
                        />

                        <Box sx={{ marginRight: 'auto', my: 1, textAlign: 'left', mb: 3 }}>
                            <Typography variant="h5" sx={{ fontSize: '1.7rem' }}>
                                {profile.firstname} {profile.lastname}
                            </Typography>
                            <Typography variant="h5" sx={{ my: 1, fontSize: '1.7rem' }} >
                                @{profile.username}
                            </Typography>
                            <Typography variant="h5" sx={{ fontSize: '1.5rem' }} >
                                Job Description Placeholder
                            </Typography>

                        </Box>
                        {allowedToEditProfile && <Button color='alert' variant="outlined" onClick={handleClick} sx={{ marginBottom: '10px' }}>Edit</Button>}
                    </Box>

                    <Divider />

                    <Box style={style} sx={{ my: 2, gap: '5rem' }}>
                        <Box className='profile__extras'>
                            <Typography variant="body1" gutterBottom>
                                <strong>Boards</strong>
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {boardsCount}
                            </Typography>
                        </Box>
                        <Box className='profile__extras'>
                            <Typography variant="body1" gutterBottom>
                                <strong>Cards</strong>
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                0
                            </Typography>
                        </Box>
                        <Box className='profile__extras'>
                            <Typography variant="body1" gutterBottom>
                                <strong>Comments</strong>
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {commentsCount}
                            </Typography>
                        </Box>
                    </Box>
                    <Divider />

                    <TabComponent profile={profile} board={board} />

                </CardContent>
            </Card>
        </Box>
    );
}