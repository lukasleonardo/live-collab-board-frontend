import { DialogHeader, DialogTitle,Dialog, DialogContent, DialogDescription  } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { UserMultiSelect } from "../UserMultiSelect";
import { Task, User } from "@/lib/types";
import { getUsers } from "@/api/usersService";
import { useTaskStore } from "@/store/useTaskStore";
import { taskFormSchema } from "@/schemas/taskSchema";
import { toast } from "react-toastify";
import { useBoardStore } from "@/store/useBoardStore";
import { useParams } from "react-router-dom";
import { useTaskActions } from "@/hooks/actions/useTaskActions";
import { useHandleGetOneBoard } from "@/hooks/actions/useBoardActions";

type TaskModalProps = {
  open: boolean
  isEditing: string
  onClose: () => void;
}


  
const TaskModal = ({ open, onClose, isEditing }:TaskModalProps) => {
    const [titleTask, setTitleTask] = useState('');
    const [descriptionTask, setDescriptionTask] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const {task,tasks} = useTaskStore();
    const { handleAddTask, handleUpdateTask, handleGetTaskById} = useTaskActions()
    const handleGetOneBoard = useHandleGetOneBoard();
    const { board } = useBoardStore();
    const {id:boardId} = useParams<{id:string}>();

    const getLastOrderInLane = (laneId: string, tasks: Task[]): number => {
      const laneTasks = tasks.filter((task) => task.laneId === laneId);
        if (laneTasks.length === 0) return 0;
          
          const maxOrder = Math.max(...laneTasks.map((task) => task.order ?? 0));
          return maxOrder + 1;
        };
        

    const handleSubmit = async () => {
      if (!titleTask ){
        toast.warning("Título é obrigatório!");
        return;
      } 

      const order = getLastOrderInLane(selectedStatus, tasks);
      const uniqueMembers = [...new Set(selectedMembers.map((u) => u._id))];
      const taskData = {
        title: titleTask,
        description: descriptionTask,
        laneId: selectedStatus,
        members: uniqueMembers,
        order, 
        boardId,
      }

      const result = taskFormSchema.safeParse(taskData);
      if (!result.success) {
        console.error("Erro ao validar tarefa:", result.error);
        toast.error("Erro ao validar tarefa!");
        return;
      }

    try{
      if(!boardId) return
      if(isEditing) {
        await handleUpdateTask(isEditing, result.data,boardId);
        toast.success("Tarefa atualizada com sucesso!");
      }else{
        await handleAddTask(result.data,boardId);
        toast.success("Tarefa criada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      toast.error("Erro ao criar tarefa!");
    }
  
    
    
      // limpa e fecha
      setTitleTask('');
      setDescriptionTask('');
      setSelectedStatus('');
      setSelectedMembers([]);
      onClose();
    };
    
    useEffect(() => {
      if(!open) return
          const fetchMembers = async () => {
            try {
              const data = await getUsers();
              setUsers(data);
            } catch (error) {
              console.log('Erro ao buscar membros', error);
            }
          };
          if(!boardId) return
          handleGetOneBoard(boardId);
      
          fetchMembers();
        }, [boardId, handleGetOneBoard, open]);

    useEffect(() => {
      if (isEditing) {
        handleGetTaskById(isEditing);  
      }

    },[boardId, handleGetTaskById, isEditing]);

    useEffect(() => {
      if (task && isEditing) {
        setTitleTask(task.title);
        setDescriptionTask(task.description);
        setSelectedStatus(task.laneId);
        setSelectedMembers(task.members);
      }
    },[task, isEditing]);

        
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-lg p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Criar Nova Tarefa</DialogTitle>
            <DialogDescription>
              Altere os campos abaixo e clique em criar para atualizar a tarefa.
            </DialogDescription>
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
            <Select value={selectedStatus} onValueChange={(value)=>setSelectedStatus(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue  placeholder="Status da tarefa" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {board?.lanes.map((lane) => (
                        <SelectItem key={lane.id} value={lane.id}>
                        {lane.title}
                        </SelectItem>
                    ))}
                     
                    </SelectGroup>
                </SelectContent>
            </Select>
            <UserMultiSelect users={users} selected={selectedMembers} onChange={(users) => setSelectedMembers(users)}/>
            <Button 
              onClick={()=>handleSubmit()} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md"
            >
              {isEditing ? 'Atualizar' : 'Criar'}
            </Button>
            <Button 
              onClick={()=>onClose()} 
              className="w-full bg-red-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md"
            >
              Cancelar
            </Button>

          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default TaskModal;
