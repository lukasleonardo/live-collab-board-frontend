

import { Route, Routes } from 'react-router-dom'
import './App.css'

import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import ListDashboards  from './pages/ListDashboards'
import DashboardPage from './pages/DashboardPage'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { SocketContext } from './hooks/socket/SocketContext'
import { useSocket } from './hooks/socket/useSocket'

function App() {
  const socket = useSocket();
  return (
    <SocketContext.Provider value={socket}>
    <ToastContainer position="bottom-right" autoClose={3000} />   
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboards' element={<ListDashboards/>}/>
      <Route path='/dashboard/:id' element={<DashboardPage/>}/>
      <Route path='/task' element={<h1>Task details</h1>}/>
      <Route path='/register' element={<Register/>}/>
    </Routes>
    </SocketContext.Provider>

  )
}

export default App
