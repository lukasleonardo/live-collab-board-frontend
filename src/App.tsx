

import { Route, Routes } from 'react-router-dom'
import './App.css'

import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import ListDashboards  from './pages/ListDashboards'
import DashboardDetails from './pages/DashboardDetails'

function App() {
  
  return (
    <>   
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboards' element={<ListDashboards/>}/>
      <Route path='/dashboard/:id' element={<DashboardDetails/>}/>
      <Route path='/task' element={<h1>Task details</h1>}/>
      <Route path='/register' element={<Register/>}/>
    </Routes>
    </>

  )
}

export default App
