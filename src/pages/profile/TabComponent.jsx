import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Typography, Tooltip, Avatar, AvatarGroup } from '@mui/material';
import UserActivity from '../../components/activity/UserActivity';
import PaginateActivity from '../../components/activity/PaginateActivity';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TabComponent.css'
import { useAuth } from '../../context/AuthContext';


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            tabIndex={0}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const fontSize =
{
    fontSize: {
        xs: '1.3rem',
        md: '1.7rem'
    }
}


export default function TabComponent({ profile, board, isOwnerProfile }) {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { currentUser } = useAuth()

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', justifySelf: 'center' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Profile" {...a11yProps(0)} />
                    <Tab label="Boards" {...a11yProps(1)} />
                    <Tab label="Activity" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>

                <Box sx={{ justifySelf: 'left' }}>
                    <Typography variant="body1" sx={{ textAlign: 'left', fontSize: '1.7rem', my: 2 }} gutterBottom>
                        Account Information
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5rem', textAlign: 'left' }}>

                    <Box>
                        <Typography sx={fontSize} variant="body1" gutterBottom>
                            <strong>Username</strong>
                        </Typography>
                        {isOwnerProfile && <Typography sx={fontSize} variant="body1" gutterBottom>
                            <strong>Email</strong>
                        </Typography>}
                        <Typography sx={fontSize} variant="body1" gutterBottom>
                            <strong>Joined</strong>{" "}
                        </Typography>

                    </Box>
                    <Box>
                        <Typography variant="body1" sx={fontSize} gutterBottom>

                            {profile.username}
                        </Typography>
                        {isOwnerProfile && <Typography variant="body1" sx={fontSize} gutterBottom>
                            {profile.email}
                        </Typography>}
                        <Typography variant="body1" sx={fontSize} gutterBottom>
                            {new Date(profile.createdAt).toLocaleDateString()}
                        </Typography>

                    </Box>


                </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                {/* <Box className='board__list' sx={{ maxHeight: '22rem' }}>
                    {board.map(item => (
                        <Box sx={{ display: 'flex', flexDirection: 'column', fontSize: '2rem', }}>
                            <NavLink to={`/columns/${item._id}`} key={item._id} className='links1'>{item.title}
                            </NavLink>
                        </Box>
                    ))}
                </Box> */}

                <Box sx={{
                    display: 'flex',
                    justifyContent: {
                        xs: 'center',
                        md: 'center'
                    },
                    maxWidth: '90vw',
                    maxHeight: '30rem',
                    overflow: 'auto',
                    gap: 2,
                    flexWrap: 'wrap',
                    border: '0.3px solid #000',
                    borderRadius: '15px',
                    p: 2
                }}>
                    {board?.map((b) => {
                        const membersList = Array.isArray(b?.members) ? b.members : [];
                        return (
                            <Box
                                key={b._id}
                                sx={{
                                    width: 190,
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
                                                <Tooltip key={m._id} title={m.user?.username || 'Member'}>
                                                    <Avatar src={m.user?.image}>
                                                        {(m.user?.username || 'M')[0].toUpperCase()}
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
                </Box >





            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <Box sx={{ maxHeight: '25rem', overflow: 'auto' }}>
                    <PaginateActivity username={profile.username} itemsPerPage={5} />
                </Box>

            </CustomTabPanel>
        </Box>
    );
}
