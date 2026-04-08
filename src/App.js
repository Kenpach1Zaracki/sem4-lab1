import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Form from './pages/Form'
import Login from './pages/Login'
import Register from './pages/Register'
import { isLoggedIn } from './auth'

// Защищённый маршрут — если не залогинен, отправляет на /login
const PrivateRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to='/login' />
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path='/detail/:id' element={<PrivateRoute><Detail /></PrivateRoute>} />
        <Route path='/add' element={<PrivateRoute><Form /></PrivateRoute>} />
        <Route path='/edit/:id' element={<PrivateRoute><Detail /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App
