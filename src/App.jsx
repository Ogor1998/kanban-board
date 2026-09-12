import { useState } from 'react'
import { lazy, Suspense } from 'react'
import './App.css'
import { Link, Routes, Route } from 'react-router-dom'
const Home = lazy(() => import('./pages/Home'))
const Show = lazy(() => import('./pages/Show'))
const Login = lazy(() => import('./users/Login'))
const Register = lazy(() => import('./users/Register'))
import Error from './utils/Error'
import { Navigate } from 'react-router-dom'
import NavBar from './common/NavBar'
import { Box } from '@mui/material'
import Profile from './pages/Profile/Profile'
import './index.css'
import CircularProgress from '@mui/material/CircularProgress';



function App() {


  return (
    // <h1>Home</h1>
    <Box className='page'>
      <NavBar />

      <Suspense fallback={<CircularProgress thickness={3.6} />}>

        <Routes>
          <Route path='/boards' element={<Home />} />
          <Route path='/columns/:boardId' element={<Show />} />
          <Route path='/profile/:username' element={<Profile />} />
          <Route path='/error' element={<Error />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path="*" element={<Navigate to="/error" state={{ statusCode: 404, message: "Page not found" }} replace />} />
        </Routes>
      </Suspense>

    </Box>
  )
}

export default App
