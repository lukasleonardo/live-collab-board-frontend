import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {api} from '../api/api'
import { useParams } from "react-router-dom";
import TaskCard from "./TaskCard";
type CartLaneProps = {
    title:string
}
interface taskProps{
  _id: string,
  title: string,
  updatedAt: string
}

const CardLane = ({title}:CartLaneProps) => {
    const [showModal, setShowModal] = useState(false);
    const [titleTask, setTitleTask] = useState('');
    const [descriptionTask, setDescriptionTask] = useState('');
    const [tasks, setTasks] = useState([]);
    const {id:boardId} = useParams<{id:string}>();


 

    useEffect(() => {
            const fetchTasks = async () => {
                try {
                const response = await api.get(`/board/${boardId}`);
                setTasks(response.data);
                } catch (error) {
                console.error('Erro ao buscar tarefas:', error);
                }
            }
        fetchTasks()
    }, [boardId,tasks]);
        

    if(!boardId){
        console.log('erro board id não encontrado')
        return null
    }
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleAddTask = (title:string, description:string,boardId:string ) => {
        console.log(title)
        console.log(description)
        console.log(boardId)
        try{
            const response = api.post('/tasks', {title, description,boardId})

            console.log(response)
            return 
        }catch(error){
            console.log("Erro ao criar tarefa: "+error)
        }
        setShowModal(false);
        return'oi'
    }


    const handleDelete = async (id:string)=>{
      console.log(id)
      try{
      await api.delete(`/tasks/${id}`)
      setTasks((prevTasks) => prevTasks.filter((task:taskProps) => task._id !== id));
      console.log(id)
      }catch(error){
          console.log("Erro ao deletar tarefa: "+error)
      }
  }
    
    return (
        <> 
        <div className="w-full size-fit mx-auto rounded-md bg-white mt-10 p-5 items-center justify-center">
            <div className="title text-2xl font-bold mb-4">
                <span className="text-primary">{title}</span>
            </div>
            <div className="taskList text-primary text-lg flex flex-col gap-3">
            {tasks.map(( task:taskProps) => (
              <TaskCard task={{
                id: task._id,
                title: task.title,
                date: task.updatedAt
              }} onDelete={handleDelete}  />
            ))}                        
            </div>

            <div className="flex items-center justify-end mt-5">
                <Button onClick={handleOpenModal}>Adicionar Tarefa +</Button>
            </div>
        </div>

         {/* Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="w-full max-w-lg p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Criar Nova Tarefa</DialogTitle>
          </DialogHeader>
     
          <div className="space-y-4">
            <Label htmlFor="task-name" className="text-white-700 font-medium">Nome da Tarefa:</Label>
            <Input 
              id="task-name" 
              type="text" 
              placeholder="Digite o nome da Tarefa..." 
              value={titleTask} 
              onChange={(e)=>setTitleTask(e.target.value)}
              className="border border-gray-300 mt-2 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            />
            <Label htmlFor="task-description" className="text-white-700 font-medium">Descrição:</Label>
            <Textarea  className="border border-gray-300 mt-2 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500" 
            id="task-description" placeholder="Descreva a tarefa.." value={descriptionTask}  onChange={(e)=>setDescriptionTask(e.target.value)}/>
            <Button 
              onClick={()=>handleAddTask(titleTask, descriptionTask,boardId)} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md"
            >
              Criar
            </Button>
          </div>
        </DialogContent>
      </Dialog></>
    )
}




export default CardLane