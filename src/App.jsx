import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Link, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Show from './pages/Show'


function App() {


  return (
    // <h1>Home</h1>


    <Routes>

      <Route path='/boards' element={<Home />} />
      <Route path='/columns/:boardId' element={<Show />} />
    </Routes>

  )
}

export default App
