import {
    Avatar,
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
    Paper,
    IconButton
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import TabComponent from "./TabComponent";
import './Profile.css'
import { useState, useEffect } from "react";
import { getProfile } from "../../api/profiles";
import ProfileSkeleton from "../../skeletons/ProfileSkeleton";
import { NavLink } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function ProfileComponent({ profile, username }) {
    const { currentUser } = useAuth();
    const [board, setBoard] = useState([])
    const [commentsCount, setCommentsCount] = useState(0)
    const [boardsCount, setboardsCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [sublength, setSublength] = useState(true)

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
    const switchSubstringLength = () => {
        setSublength(prev => !prev)
    }

    const isOwnerProfile = profile?._id === currentUser?._id

    if (!profile || loading) return <ProfileSkeleton />

    return (

        <Paper sx={{
            width: "100%",
            maxWidth: { xs: 480, md: 600 },
            mx: "auto",
            mt: 4,
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
        }}>


            {/* ── Avatar + Name Section ── */}
            <Box sx={{
                display: 'flex',
                flexDirection: {
                    xs: 'column',
                    md: 'row',
                },
                alignItems: 'center',
                gap: 3,
                // mb: 4,
                // pb: 3,
            }}>
                <Avatar
                    src={profile?.image}
                    alt={profile?.username}
                    sx={{ width: 120, height: 120 }}  // ← bigger avatar
                />
                <Box sx={{ flex: 1 }}>  {/* ← flex: 1 takes remaining space */}
                    <Typography variant="h4" fontWeight={600} sx={{ width: '100%', textWrap: 'nowrap', fontSize: '2rem' }}>
                        {profile?.firstname} {profile?.lastname}
                    </Typography>
                    <Typography sx={{ fontSize: '1.5rem', color: 'text.secondary', my: 0.5 }}>
                        @{profile?.username}
                    </Typography>
                    <Typography sx={{
                        fontSize: {
                            xs: '1.2rem',
                            md: '1.5rem'
                        }, color: 'text.secondary',

                    }} variant="body1">
                        {sublength ? profile?.description?.substring(0, 100) || 'Job description placeholder' : profile.description}
                        <Button sx={{
                            fontSize: {
                                xs: '1.2rem',
                                md: '1.25rem'
                            }

                        }}
                            startIcon={
                                sublength ? (
                                    <ArrowDropDownIcon />

                                ) : (
                                    <ArrowDropUpIcon />
                                )
                            }
                            onClick={() => switchSubstringLength()}>{sublength ? 'Show More' : 'Show Less'}</Button>
                    </Typography>
                </Box>
                {isOwnerProfile && (
                    <Button
                        component={RouterLink}
                        to={`/profile/${username}/edit`}
                        variant="outlined"
                        color="inherit"
                    >
                        Edit
                    </Button>
                )}
            </Box>

            <Divider />

            {/* ── Stats Section ── */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-around',
                // py: 3,
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
                <TabComponent profile={profile} board={board} isOwnerProfile={isOwnerProfile} />
            </Box>
            {/* </Box> */}
        </Paper >
    )

}