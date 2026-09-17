import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function SearchField({ setSearch }) {
    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': {
                    m: 1, maxWidth: 700,
                    width: '90%',

                    display: 'flex',
                    justifyContent: 'center'
                }
            }}
            noValidate
            autoComplete="off"
        >
            <div>

                <TextField id="outlined-search" size='small' label="Search Posts" type="search" onChange={(e) => setSearch(e.target.value)} />
            </div>

        </Box>
    );
}
