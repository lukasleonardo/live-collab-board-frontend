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

type TaskModalProps = {
  lanes:{title:string, id:string}[]
  tasks:Task[]
  open: boolean
  onClose: () => void;
  onSave: (taskData: any) => void;
}

const getLastOrderInLane = (laneId: string, tasks: Task[]): number => {
  const laneTasks = tasks.filter((task) => task.laneId === laneId);
  if (laneTasks.length === 0) return 0;
  
  const maxOrder = Math.max(...laneTasks.map((task) => task.order ?? 0));
  return maxOrder + 1;
};

  
const TaskModal = ({ lanes,open,tasks, onClose, onSave }:TaskModalProps) => {
    const [titleTask, setTitleTask] = useState('');
    const [descriptionTask, setDescriptionTask] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);

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
      
          fetchMembers();
        }, [open]);

    const handleAddTask = () => {
      if (!titleTask || !selectedStatus) return;
      const order = getLastOrderInLane(selectedStatus, tasks);
      onSave({
        title: titleTask,
        description: descriptionTask,
        laneId: selectedStatus,
        members: selectedMembers.map((u) => u._id),
        order, 
      });
    
      // limpa e fecha
      setTitleTask('');
      setDescriptionTask('');
      setSelectedStatus('');
      setSelectedMembers([]);
      onClose();
    };
    


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
            <Select onValueChange={(value)=>setSelectedStatus(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue  placeholder="Status da tarefa" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {lanes.map((lane) => (
                        <SelectItem key={lane.id} value={lane.id}>
                        {lane.title}
                        </SelectItem>
                    ))}
                     
                    </SelectGroup>
                </SelectContent>
            </Select>
            <UserMultiSelect users={users} selected={selectedMembers} onChange={(users) => setSelectedMembers(users)}/>
            <Button 
              onClick={()=>handleAddTask()} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md"
            >
              Criar
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
  