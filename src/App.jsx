import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Link, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Show from './pages/Show'
import Error from './utils/Error'
import { Navigate } from 'react-router-dom'
import NavBar from './common/NavBar'
import { Box } from '@mui/material'
import Login from './users/Login'
import Register from './users/Register'



function App() {


  return (
    // <h1>Home</h1>
    <Box>
      <NavBar />

      <Routes>

        <Route path='/boards' element={<Home />} />
        <Route path='/columns/:boardId' element={<Show />} />
        <Route path='/error' element={<Error />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="*" element={<Navigate to="/error" state={{ statusCode: 404, message: "Page not found" }} replace />} />
      </Routes>

    </Box>
  )
}

export default App
