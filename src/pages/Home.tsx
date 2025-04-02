import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const Home = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h1>Home</h1>
            <h1>Olá Mundo</h1>
        <Button onClick={()=>navigate('/login')}>Login</Button>
        <Button onClick={()=>navigate('/dashboard/1')}>List Dashboards</Button>
        <Button onClick={()=>navigate('/task')}>Task Details</Button>

        </div>
    )
}

export default Home