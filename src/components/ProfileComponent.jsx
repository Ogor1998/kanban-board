import {
    Avatar,
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import TabComponent from "../pages/profile/TabComponent";
import '../pages/profile/Profile.css'
import { useState, useEffect } from "react";
import { getProfile } from "../api/profiles";
import ProfileSkeleton from "../skeletons/ProfileSkeleton";

export default function ProfileComponent({ profile, handleClick }) {
    const { currentUser } = useAuth();
    const [board, setBoard] = useState([])
    const [commentsCount, setCommentsCount] = useState(0)
    const [boardsCount, setboardsCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!profile) return
        const fetchBoards = async () => {
            try {
                const res = await getProfile(profile.username)
                setBoard(res.data.board)
                setboardsCount(res.data.boardCount)
                setCommentsCount(res.data.commentsCount)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchBoards()
    }, [profile])

    const allowedToEditProfile = profile?._id === currentUser?._id

    if (!profile || loading) return <ProfileSkeleton />

    return (
        <Box sx={{
            mt: 5,
            px: 4,        // ← side padding
            maxWidth: 900, // ← wider max width
            margin: '40px auto'  // ← centered but wider
        }}>
            <Card sx={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.3)', width: '100%' }}>
                <CardContent sx={{ p: 4 }}>  {/* ← more internal padding */}

                    {/* ── Avatar + Name Section ── */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 3,
                        mb: 4,
                        pb: 3,
                    }}>
                        <Avatar
                            src={profile.image}
                            alt={profile.username}
                            sx={{ width: 120, height: 120 }}  // ← bigger avatar
                        />
                        <Box sx={{ flex: 1 }}>  {/* ← flex: 1 takes remaining space */}
                            <Typography variant="h4" fontWeight={600}>
                                {profile.firstname} {profile.lastname}
                            </Typography>
                            <Typography sx={{ fontSize: '1.5rem', color: 'text.secondary', my: 0.5 }}>
                                @{profile.username}
                            </Typography>
                            <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary' }}>
                                Job Description Placeholder
                            </Typography>
                        </Box>
                        {allowedToEditProfile && (
                            <Button variant="outlined" onClick={handleClick}>
                                Edit
                            </Button>
                        )}
                    </Box>

                    <Divider />

                    {/* ── Stats Section ── */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        py: 3,
                    }}>
                        {[
                            { label: 'Boards', value: boardsCount },
                            { label: 'Cards', value: 0 },
                            { label: 'Comments', value: commentsCount }
                        ].map(stat => (
                            <Box key={stat.label} sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" fontWeight={700}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {stat.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Divider />

                    {/* ── Tabs Section ── */}
                    <Box sx={{ mt: 3 }}>
                        <TabComponent profile={profile} board={board} />
                    </Box>

                </CardContent>
            </Card>
        </Box>
    )

}