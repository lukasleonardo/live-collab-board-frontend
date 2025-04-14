

import { Route, Routes } from 'react-router-dom'
import './App.css'

import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import ListDashboards  from './pages/ListDashboards'
import DashboardPage from './pages/DashboardPage'

function App() {
  
  return (
    <>   
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboards' element={<ListDashboards/>}/>
      <Route path='/dashboard/:id' element={<DashboardPage/>}/>
      <Route path='/task' element={<h1>Task details</h1>}/>
      <Route path='/register' element={<Register/>}/>
    </Routes>
    </>

  )
}

export default App
