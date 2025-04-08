import { useEffect, useMemo, useState } from "react";

import {api} from '../api/api'
import { useLocation, useParams } from "react-router-dom";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  closestCorners
} from '@dnd-kit/core';
import { DroppableLane } from "@/components/DropableLane";
interface Task{
  _id: string,
  title: string,
  description: string,
  boardId: string,
  updatedAt: string
  status: string
}
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const updateTasksOrder = async (orderedTasks: Task[]) => {
  await api.post('/tasks/reorder', {
    tasks: orderedTasks.map((task, index) => ({
      id: task._id,
      order: index
    }))
  });
};

const DashboardDetails = () => {
    const location = useLocation();
    const {name} = location.state
    const [showModal, setShowModal] = useState(false);
    const [titleTask, setTitleTask] = useState('');
    const [descriptionTask, setDescriptionTask] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const {id:boardId} = useParams<{id:string}>();
    //const lanes = ["To Do", "In Progress", "Done"];
    const statuses = ["todo", "inprogress", "done"];

 

    useEffect(() => {
            const fetchTasks = async () => {
              console.log(boardId)
                try {
                const response = await api.get(`/tasks/board/${boardId}`);

                setTasks(response.data);
                } catch (error) {
                console.error('Erro ao buscar tarefas:', error);
                }
            }
        fetchTasks()
    }, [boardId]);
        

    if(!boardId){
        console.log('erro board id não encontrado')
        return null
    }
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleAddTask = async (title:string, description:string,boardId:string, status:string ) => {
        try{
            const response = await api.post('/tasks', {title, description,boardId,status})
            setTasks([...tasks,response.data])
            setDescriptionTask('')
            setTitleTask('')
            setShowModal(false);
        }catch(error){
            console.log("Erro ao criar tarefa: "+error)
        }finally{
            
            setDescriptionTask('')
            setTitleTask('')
            setShowModal(false);
        }
    }


    const handleDelete = async (id:string)=>{
      try{
      await api.delete(`/tasks/${id}`)
      setTasks((prevTasks) => prevTasks.filter((task:Task) => task._id !== id));
      }catch(error){
          console.log("Erro ao deletar tarefa: "+error)
      }
  }
  
 

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tasksByStatus = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);
  


  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      delay: 200, 
      tolerance: 5, 
    },
  }))

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
  
    if (!over || active.id === over.id) return;
  
    const activeTask = tasks.find(task => task._id === active.id);
    const overTask = tasks.find(task => task._id === over.id);
  
    if (!activeTask) return;
  
    const activeStatus = activeTask.status;
    const overStatus = overTask?.status || over.id;
  
    // Atualização de status se mudou de raia
    if (activeStatus !== overStatus) {
      try {
        await api.patch(`/tasks/status/${activeTask._id}`, { status: overStatus });
  
        const updatedTasks = tasks.map(task =>
          task._id === activeTask._id ? { ...task, status: overStatus } : task
        );
        setTasks(updatedTasks);
      } catch (error) {
        console.log("Erro ao atualizar status da tarefa:", error);
      }
    }
  
    const updatedActiveLaneTasks = tasks
      .filter(task => task.status === (activeStatus !== overStatus ? overStatus : activeStatus));
  
    const oldIndex = updatedActiveLaneTasks.findIndex(task => task._id === active.id);
    const newIndex = updatedActiveLaneTasks.findIndex(task => task._id === over.id);
  
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const reordered = arrayMove(updatedActiveLaneTasks, oldIndex, newIndex);
  
      const otherTasks = tasks.filter(task => task.status !== (activeStatus !== overStatus ? overStatus : activeStatus));
      const newAllTasks = [...otherTasks, ...reordered];
      setTasks(newAllTasks);
  
      updateTasksOrder(reordered);
    }
  };
  
  

    return (
        <div className="w-full size-fit mx-auto rounded-md bg-white mt-10 p-5 items-center justify-center">
            <h1 className="text-2xl font-bold text-primary mb-5">{name}</h1>
            <div className="taskList text-primary text-lg flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-4">
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            {statuses.map((status) => (
              <DroppableLane key={status} id={status} title={status}>
              <SortableContext
                items={tasksByStatus[status].map(task => task._id)}
                strategy={verticalListSortingStrategy}
              >
                {tasksByStatus[status].map(task => (
                  <TaskCard key={task._id} task={{ id: task._id, title: task.title, date: task.updatedAt, status: task.status}} onDelete={handleDelete} />
                ))}
              </SortableContext>
            </DroppableLane>
            ))}
            </DndContext>
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
            <Select onValueChange={(value)=>setSelectedStatus(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue  placeholder="Selecione o estado da tarefa" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inprogress">In-progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Button 
              onClick={()=>handleAddTask(titleTask, descriptionTask,boardId,selectedStatus)} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md"
            >
              Criar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    )
}




export default DashboardDetails

