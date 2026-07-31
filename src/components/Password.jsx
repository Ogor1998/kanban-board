import React, { useState } from 'react'
import { InputAdornment, IconButton, TextField } from "@mui/material"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

const Password = ({ formData, handleChange }) => {

    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    return (
        <TextField id="outlined-basic"
            label="Password"
            variant="outlined"
            name='password'
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            slotProps=
            {{
                input: {

                    endAdornment: (
                        < InputAdornment position="end" >
                            <IconButton
                                aria-label={
                                    showPassword ? 'hide the password' : 'display the password'
                                }
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }
            }}
        />
    )
}

export default Password