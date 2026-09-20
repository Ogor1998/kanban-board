import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import UserActivity from './UserActivity';
import PaginateActivity from './PaginateActivity';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import './TabComponent.css'


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

export default function TabComponent({ profile, board }) {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                        <Typography variant="body1" gutterBottom>
                            <strong>Username</strong>
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Email</strong>
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Joined</strong>{" "}
                        </Typography>

                    </Box>
                    <Box>
                        <Typography variant="body1" sx={{ marginRight: 'auto' }} gutterBottom>

                            {profile.username}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {profile.email}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {new Date(profile.createdAt).toLocaleDateString()}
                        </Typography>

                    </Box>


                </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                {board.map(item => (
                    <Box sx={{ display: 'flex', flexDirection: 'column', fontSize: '2rem' }}>
                        <NavLink to={`/columns/${item._id}`} key={item._id} className='links'>{item.title}
                        </NavLink>
                    </Box>
                ))}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <PaginateActivity username={profile.username} itemsPerPage={5} />
            </CustomTabPanel>
        </Box>
    );
}
